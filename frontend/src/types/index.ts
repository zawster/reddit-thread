export interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    username: string;
    password: string;
}
export interface Subreddit {
    id: number;
    name: string;
    title: string;
    description?: string;
    icon_url?: string;
    owner_id: number;
    created_at: string;
}

export interface Post {
    id: number;
    title: string;
    content?: string;
    created_at: string;
    author: {
        username: string;
    };
    subreddit: {
        name: string;
        icon_url?: string;
    };
    upvotes: number;
    downvotes: number;
    user_vote?: number | null;
}
