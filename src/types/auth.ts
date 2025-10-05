export interface User {
     id?: number
    email: string;
    password?: string;
    type: 'ADMIN' | 'USER';
    profile: {
        avatar: string;
        full_name: string;
        nickname: string;
        background_image?: string | null;
    }
}

export interface AuthState {
    token: string | null;
    user: User | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}