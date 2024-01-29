export interface AppUser {
    email: string;
    password: string;
}

export interface AppUserAuth {
    usuarioId: number;
    nombre: string;
    apellidos: string;
    nombreCompleto: string;
    email: string;
    rol: string;
    isAuthenticated: boolean;
    token: string;
    claims: Array<AppRolClaim>;
    formulariosAsignados: Array<FormulariosAsignados>
}

export interface AppRolClaim {
    claimRolID: string;
    rolId: number;
    claimType: string;
    claimValue: boolean;
}

export interface FormulariosAsignados {
  formularioUsuarioId: number;
  formName: string;
  googleFormId: string;
  estatus: boolean;
}
