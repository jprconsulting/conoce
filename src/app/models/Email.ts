export interface Email {
    id: number;
    emailOrigen: string;
    contraseña: string;
    credenciales: boolean;
    nombreUsuario: string;
    servidorOrigen: number;
    puertoOrigen: string;
    confiarCertificado: boolean;
    perfilCorreo: string;
}
