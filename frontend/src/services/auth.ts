import api from '../lib/api';
import { LoginCredentials, RegisterCredentials, User, AuthResponse } from '@/types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const formData = new FormData();
        formData.append('username', credentials.email); // OAuth2 expects 'username' field
        formData.append('password', credentials.password);

        const response = await api.post<AuthResponse>('/login/access-token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<User> => {
        const response = await api.post<User>('/users/', {
            email: credentials.email,
            username: credentials.username,
            password: credentials.password,
            full_name: credentials.username, // Defaulting full_name to username for now
        });
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/users/me');
        return response.data;
    },
};
