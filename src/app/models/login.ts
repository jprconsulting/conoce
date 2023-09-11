export interface AppUser {
    nombreUsuario: string;
    clave: string;
}

export interface AppUserAuth {
    nombre: string;
    apellidos: string;
    email: string;
    nombreRol: number;
    isAuthenticated: boolean;
    token: string;
    claims: Array<AppRolClaim>;
}

export interface AppRolClaim {
    claimRolID: string;
    rolId: number;
    claimType: string;
    claimValue: boolean;
}

