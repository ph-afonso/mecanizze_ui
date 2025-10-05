// /src/stores/auth-store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue'; // Importamos ref e computed
import { api } from 'boot/axios';
import { Notify, Dialog } from 'quasar';
import type { User, LoginCredentials } from 'src/types/auth';

// Esta é a nova forma de definir a store (Setup Store)
export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // O que antes era 'state', agora são refs reativas.
  const token = ref<string | null>(localStorage.getItem('token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
  const user = ref<User | null>(null);
  // O timerId agora é uma variável normal dentro do escopo da store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timerId: any = null;

  // --- GETTERS ---
  // O que antes era 'getters', agora são propriedades computadas.
  const isAuthenticated = computed(() => !!token.value);
  const getUser = computed(() => user.value);

  // --- ACTIONS ---
  // O que antes era 'actions', agora são funções normais.

  function stopSessionTimer() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }
  
  function logout() {
    stopSessionTimer();
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    window.location.replace('/login');
  }

  async function renewToken() {
  if (!refreshToken.value) {
    logout();
    throw new Error('Refresh token não encontrado.');
  }

  try {
    // 1. O corpo da requisição agora é um objeto JSON simples
    const requestBody = {
      refresh_token: refreshToken.value
    };

    // 2. A chamada é feita para o novo endpoint '/token/refresh'
    const response = await api.post('/token/refresh', requestBody);

    // 3. Extraímos o novo access_token da resposta
    const newAccessToken = response.data.access_token;
    if (!newAccessToken) {
      throw new Error('Novo token de acesso não recebido da API de refresh.');
    }

    // 4. Atualizamos o estado, o localStorage e o cabeçalho do Axios
    token.value = newAccessToken;
    localStorage.setItem('token', newAccessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    // 5. Reiniciamos o timer da sessão com a validade do novo token
    startSessionTimer();

  } catch (error) {
    console.error('Falha ao renovar token:', error);
    // Se o refresh token for inválido/expirado, a API provavelmente retornará um erro,
    // que será capturado aqui, e nós deslogamos o usuário.
    logout();
    throw error;
  }
}

  function promptRenewal() {
    let secondsLeft = 10;
    const dialog = Dialog.create({
      title: 'Sessão Expirando',
      message: `Sua sessão irá expirar em ${secondsLeft} segundos. Deseja renová-la?`,
      persistent: true,
      ok: { label: 'Renovar', color: 'primary' },
      cancel: { label: 'Sair' },
    });
    const interval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        dialog.update({ message: `Sua sessão irá expirar em ${secondsLeft} segundos...` });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    const logoutTimeout = setTimeout(() => {
      clearInterval(interval);
      dialog.hide();
      logout();
    }, 10000);

    dialog.onOk(() => {
      clearInterval(interval);
      clearTimeout(logoutTimeout);
      // Usamos 'void' para corrigir o aviso de 'no-misused-promises'
      void renewToken().then(() => {
        Notify.create({ type: 'positive', message: 'Sessão renovada com sucesso!' });
      }).catch(() => {
        Notify.create({ type: 'negative', message: 'Não foi possível renovar a sessão. Faça o login novamente.' });
      });
    });

    dialog.onCancel(() => {
      clearInterval(interval);
      clearTimeout(logoutTimeout);
      logout();
    });
  }

  function startSessionTimer() {
    stopSessionTimer(); // Limpa qualquer timer antigo para começar do zero
    const TOKEN_DURATION_MS = 60 * 60 * 1000; 
    const RENEWAL_PROMPT_SECONDS_BEFORE = 10;
    const timeoutDuration = TOKEN_DURATION_MS - (RENEWAL_PROMPT_SECONDS_BEFORE * 1000);

    if (timeoutDuration > 0) {
      timerId = setTimeout(() => promptRenewal(), timeoutDuration);
    }
 }

  async function fetchUser(): Promise<User> {
    try {
      const response = await api.get<User>('/users/me');
      user.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Falha ao buscar dados do usuário (token pode ter expirado):', error);
      logout();
      throw error;
    }
  }

  async function login(credentials: LoginCredentials): Promise<User> {
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);
    try {
      const response = await api.post('/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const newAccessToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;

      token.value = newAccessToken;
      refreshToken.value = newRefreshToken;
      localStorage.setItem('token', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      startSessionTimer();
      return await fetchUser();
    } catch (error) {
      logout();
      console.error('Falha no login:', error);
      throw new Error('Credenciais inválidas!');
    }
  }

  async function checkAuth(): Promise<void> {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      try {
        await fetchUser();
        startSessionTimer();
      } catch {
        // fetchUser já chama o logout
      }
    }
  }

  // O que a store expõe para o mundo exterior
  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    getUser,
    login,
    logout,
    checkAuth,
    fetchUser,
    renewToken
  };
});