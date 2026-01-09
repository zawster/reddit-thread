/**
 * Axios API Client Configuration
 *
 * This module sets up the axios instance with interceptors for
 * authentication and error handling across the application.
 */

import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API Request Error]', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`[API Error] ${error.response?.status || 'Network Error'} ${error.config?.url}`);
        if (error.response?.status === 401) {
            // Only clear token if it exists (prevents infinite loops if /me is called without token)
            if (localStorage.getItem('token')) {
                localStorage.removeItem('token');
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
