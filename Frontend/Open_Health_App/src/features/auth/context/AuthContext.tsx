import { createContext, ReactNode, useContext, useState } from 'react';

import { authService } from '@/features/auth/api/authService';
import { ICadastroRequest, ILoginRequest, IUsuarioResponse } from '@/features/auth/types/auth.type';

type AuthContextValue = {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    user: IUsuarioResponse | null;
    login: (credentials: ILoginRequest) => Promise<void>;
    register: (payload: ICadastroRequest) => Promise<void>;
    refreshProfile: () => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUsuarioResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (credentials: ILoginRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            setToken(response.token);
            setUser(response.usuario);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (payload: ICadastroRequest) => {
        setIsLoading(true);
        try {
            await authService.registrar(payload);
            const response = await authService.login({
                email: payload.email,
                senha: payload.senha,
            });
            setToken(response.token);
            setUser(response.usuario);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshProfile = async () => {
        if (!token) {
            return;
        }

        setIsLoading(true);
        try {
            const profile = await authService.buscarPerfil(token);
            setUser(profile);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const value = {
        isAuthenticated: Boolean(token),
        isLoading,
        token,
        user,
        login,
        register,
        refreshProfile,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
