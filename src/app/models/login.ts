export interface AppUser {
    nombreUsuario: string;
    clave: string;
}

export interface AppUserAuth {
    nombre: string;
    apellidos: string;
    email: string;
    rolId: number;
    isAuthenticated: boolean;
    token: string;
}

