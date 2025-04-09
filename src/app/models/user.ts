export type AuthResponse = {
    type: 'success' | 'error';
    message: string;
    token?: string;
};
