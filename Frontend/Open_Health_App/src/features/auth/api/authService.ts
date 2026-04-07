import axios, { isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { IAuthResponse, ICadastroRequest, ILoginRequest, IUsuarioResponse } from '@/features/auth/types/auth.type';

function getApiBaseUrl() {
    const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }

    const hostUri =
        (Constants.expoConfig as { hostUri?: string } | null)?.hostUri ??
        ((Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2?.extra?.expoClient?.hostUri ?? '');

    if (hostUri) {
        const host = hostUri.split(':')[0];
        return `http://${host}:8080`;
    }

    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }

    return 'http://localhost:8080';
}

const api = axios.create({
    baseURL: `${getApiBaseUrl()}/auth`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

function extractErrorMessage(error: unknown) {
    if (isAxiosError<{ erro?: string }>(error)) {
        return error.response?.data?.erro ?? 'Erro ao conectar com o servidor';
    }

    return 'Erro ao conectar com o servidor';
}

export const authService = {
    registrar: async (dados: ICadastroRequest): Promise<IUsuarioResponse> => {
        try {
            const response = await api.post<IUsuarioResponse>('/registrar', dados);
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    login: async (dados: ILoginRequest): Promise<IAuthResponse> => {
        try {
            const response = await api.post<IAuthResponse>('/login', dados);
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    buscarPerfil: async (token: string): Promise<IUsuarioResponse> => {
        try {
            const response = await api.get<IUsuarioResponse>('/perfil', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },
};
