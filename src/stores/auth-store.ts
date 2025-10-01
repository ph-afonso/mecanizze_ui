import { defineStore } from 'pinia';
import { api } from 'boot/axios';

import type {
    User,
    AuthState,
    LoginCredentials
} from 'src/types/auth';

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('token') || null,
        user: null
    }),
    getters: {
        isAuthenticated: (state): boolean => !!state.token,
        getUser: (state) => state.user,
    },
    actions: {
        /**
         * Realiza o login na API, obtém o token e busca os dados do usuário.
         */
        async login(credentials: LoginCredentials): Promise<User> {
            // 1. Sua API espera dados no formato x-www-form-urlencoded.
            // O URLSearchParams é a forma correta de criar esses dados.
            const params = new URLSearchParams();
            params.append('username', credentials.email); // A API espera 'username', não 'email'
            params.append('password', credentials.password);

            try {
                // 2. Faz a chamada POST para o endpoint /token
                const response = await api.post('/token', params, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                const token = response.data.access_token;
                if (!token) {
                    throw new Error('Token de acesso não recebido da API');
                }

                // 3. Guarda o token e configura o cabeçalho do Axios para futuras chamadas
                this.token = token;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // 4. Com o token em mãos, busca os dados detalhados do usuário
                return await this.fetchUser();

            } catch (error) {
                // Em caso de erro, limpa qualquer estado de login residual
                this.logout();
                console.error('Falha no login:', error);
                throw new Error('Credenciais inválidas!');
            }
        },

        /**
         * Busca os dados do usuário logado usando o token atual.
         */
        async fetchUser(): Promise<User> {
            if (!this.token) {
                throw new Error('Nenhum token disponível para buscar o usuário.');
            }
            try {
                // IMPORTANTE: Sua API precisa de um endpoint que retorne os dados
                // do usuário logado. O padrão é '/users/me'.
                // Se o seu for diferente (ex: '/profile'), ajuste a URL abaixo.
                const response = await api.get<User>('/users/me');
                this.user = response.data;
                return response.data;
            } catch (error) {
                console.error('Falha ao buscar dados do usuário:', error);
                // Se a busca falhar (ex: token expirado), desloga o usuário
                this.logout();
                throw error;
            }
        },

        /**
         * Ação de logout, limpa todos os dados de autenticação.
         */
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            // Usamos replace para evitar que o usuário volte para a página anterior no histórico
            window.location.replace('/login');
        },

        /**
         * Verifica a autenticação ao carregar a aplicação.
         * Se um token existe, tenta buscar os dados do usuário para validar a sessão.
         */
        async checkAuth(): Promise<void> {
            if (this.token) {
                // Configura o header do Axios logo no início
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                // Tenta buscar os dados do usuário para validar o token
                await this.fetchUser();
            }
        }
    }
});