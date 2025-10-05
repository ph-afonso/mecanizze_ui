import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { User } from 'src/types/auth';
import { Notify } from 'quasar';
import { useAuthStore } from './auth-store';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  dialogOpen: boolean;
  editingUser: User | null;
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
    error: null,
    dialogOpen: false,
    editingUser: null,
  }),

  actions: {
    openUserDialog(user: User | null) {
      this.editingUser = user ? JSON.parse(JSON.stringify(user)) : null;
      this.dialogOpen = true;
    },

    closeUserDialog() {
      this.dialogOpen = false;
      setTimeout(() => {
        this.editingUser = null;
      }, 300);
    },

    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get<User[]>('/users');
        this.users = response.data;
      } catch {
        this.error = 'Falha ao buscar usuários.';
        Notify.create({ type: 'negative', message: this.error });
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: User) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post<User>('/users', userData);
        this.users.unshift(response.data);
        Notify.create({ type: 'positive', message: 'Usuário criado com sucesso!' });
      } catch {
        this.error = 'Falha ao criar usuário.';
        Notify.create({ type: 'negative', message: this.error });
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId: number | string, userData: User) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put<User>(`/users/${userId}`, userData);
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users[index] = response.data;
        }

        const authStore = useAuthStore();
        if (authStore.user?.id === userId) {
          await authStore.fetchUser();
        }

        Notify.create({ type: 'positive', message: 'Usuário atualizado com sucesso!' });
      } catch {
        this.error = 'Falha ao atualizar usuário.';
        Notify.create({ type: 'negative', message: this.error });
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: number | string) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/users/${userId}`);
        this.users = this.users.filter(u => u.id !== userId);
        Notify.create({ type: 'positive', message: 'Usuário deletado com sucesso!' });
      } catch {
        this.error = 'Falha ao deletar usuário.';
        Notify.create({ type: 'negative', message: this.error });
      } finally {
        this.loading = false;
      }
    },
  },
});