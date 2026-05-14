import { IAuthResponse, ICadastroRequest, ILoginRequest, IUsuarioResponse, IUsuarioUpdateRequest } from '@/features/auth/types/auth.type';
import { api, extractErrorMessage } from '@/lib/api';

function getAuthHeader(token: string) {
    return {
        Authorization: `Bearer ${token}`,
    };
}

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
                headers: getAuthHeader(token),
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    atualizarPerfil: async (token: string, dados: IUsuarioUpdateRequest): Promise<IAuthResponse> => {
        try {
            const response = await api.put<IAuthResponse>('/auth/perfil', dados, {
                headers: getAuthHeader(token),
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },

    deletarPerfil: async (token: string): Promise<void> => {
        try {
            await api.delete('/auth/perfil', {
                headers: getAuthHeader(token),
            });
        } catch (error) {
            throw new Error(extractErrorMessage(error));
        }
    },
};
