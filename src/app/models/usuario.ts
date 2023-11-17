
export interface Usuario {
    usuarioId: number;
    rolId: number;
    rol: string;
    email: string;
    password: string;
    estatus?: boolean;
    nombre: string;
    apellidos: string;
}
