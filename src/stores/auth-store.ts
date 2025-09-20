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
        async login(credentials: LoginCredentials): Promise<User> {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (credentials.email === 'admin@quasar.com' && credentials.password === 'password') {
                const fakeToken = 'mock-jwt-token.' + btoa(JSON.stringify({ user: 'Admin'})) + '.signature';

                const fakeUser: User = {
                    name: 'Admin Quasar',
                    email: 'admin@quasar.com',
                    role: 'admin'
                };

                this.token = fakeToken;
                localStorage.setItem('token', fakeToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${fakeToken}`;
                this.user = fakeUser;
                
                return Promise.resolve(fakeUser);
            } else {
                return Promise.reject(new Error('Credenciais inválidas'));
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        },

        checkAuth(): void {

            if (!this.token) {
                return;
            }

            try {
                // A resposta do backend deveria ser do tipo User
                const fakeUser: User = {
                    name: 'Admin Quasar',
                    email: 'admin@quasar.com',
                    role: 'admin'
                };
                this.user = fakeUser;
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            } catch {
                this.logout();
            }
        }
    }
});