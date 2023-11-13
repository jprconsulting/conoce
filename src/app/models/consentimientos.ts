export interface Consentimiento {
    id: number;
    nombre: string;
    email: string;
    estado: boolean;
    fechadenvio: Date;
    fechaaceptacion: Date;
    cuerpocorreo: string;
}