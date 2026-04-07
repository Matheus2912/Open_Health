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
    senha: string;
    confirmarSenha: string;
}

export interface IUsuarioResponse {
    id: string;
    nomeCompleto: string;
    email: string;
    cpf: string;
    tipoSanguineo: string;
    sexo: string;
    dataNascimento: string;
}

export interface IAuthResponse {
    token: string;
    tipo: string;
    usuario: IUsuarioResponse;
}
