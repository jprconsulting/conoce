export interface Email {
    Id: number;
    EmailOrigen: string;
    Contraseña: string;
    Credenciales: boolean;
    NombreUsuario: string;
    ServidorOrigen: number;
    PuertoOrigen: string;
    ConfiarCertificado: boolean;
}
