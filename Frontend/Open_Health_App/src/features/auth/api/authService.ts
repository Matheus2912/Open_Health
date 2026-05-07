import { IAuthResponse, ICadastroRequest, ILoginRequest, IUsuarioResponse } from '@/features/auth/types/auth.type';
import { api, extractErrorMessage } from '@/lib/api';

export const authService = {
    registrar: async (dados: ICadastroRequest): Promise<IUsuarioResponse> => {
        try {
            const response = await api.post<IUsuarioResponse>('/auth/registrar', dados);
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    login: async (dados: ILoginRequest): Promise<IAuthResponse> => {
        try {
            const response = await api.post<IAuthResponse>('/auth/login', dados);
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    buscarPerfil: async (token: string): Promise<IUsuarioResponse> => {
        try {
            const response = await api.get<IUsuarioResponse>('/auth/perfil', {
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
