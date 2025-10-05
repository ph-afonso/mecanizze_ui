// src/boot/auth-init.ts
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'src/stores/auth-store';

export default boot(async () => {
  const authStore = useAuthStore();

  // Se um token existir no localStorage, execute a verificação de autenticação.
  if (authStore.token) {
    try {
      // Usamos 'await' para garantir que a aplicação espere
      // a conclusão do checkAuth (que inclui a chamada para fetchUser).
      await authStore.checkAuth();
    } catch {
      // Se checkAuth falhar (ex: token inválido), o próprio checkAuth já chama o logout,
      // então não precisamos fazer nada aqui. O guardião de rota fará o redirecionamento.
      console.error('Falha na verificação de autenticação inicial.');
    }
  }
});