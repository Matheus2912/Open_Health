export interface ILoginRequest {
    email: string;
    senha: string;
}

export interface ICadastroRequest {
    nomeCompleto: string;
    email: string;
    cpf: string;
    tipoSanguineo?: string;
    dataNascimento: string;
    sexo: string;
    telefoneEmergencia?: string;
    senha: string;
    confirmarSenha: string;
}

export type IUsuarioUpdateRequest = Omit<ICadastroRequest, 'senha' | 'confirmarSenha'>;

export interface IUsuarioResponse {
    id: string;
    nomeCompleto: string;
    email: string;
    cpf: string;
    tipoSanguineo: string;
    sexo: string;
    dataNascimento: string;
    telefoneEmergencia?: string | null;
}

export interface IAuthResponse {
    token: string;
    tipo: string;
    usuario: IUsuarioResponse;
}
