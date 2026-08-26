export interface UsuarioRequest {
    username: string, 
    password: string,
    roles: string[]
}

export interface UsuarioResponse {
    username: string, 
    roles: string[]
}