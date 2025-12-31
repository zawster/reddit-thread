"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { User, LoginCredentials, RegisterCredentials } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authService.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Auth initialization failed", error);
                    // No need to clear token here, the interceptor handles it
                }
            }
            setLoading(false);
        };

        if (typeof window !== 'undefined') {
            initAuth();
        }
    }, [router]);

    const login = async (credentials: LoginCredentials) => {
        const { access_token } = await authService.login(credentials);
        localStorage.setItem('token', access_token);
        const userData = await authService.getMe();
        setUser(userData);
        router.push('/');
    };

    const register = async (credentials: RegisterCredentials) => {
        await authService.register(credentials);
        // Auto login after register
        await login({ email: credentials.email, password: credentials.password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
