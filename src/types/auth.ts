export interface User {
    name: string;
    email: string;
    role: 'admin' | 'user';
}

export interface AuthState {
    token: string | null;
    user: User | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}