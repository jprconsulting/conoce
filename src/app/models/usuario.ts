import { Rol } from "./Rol";

export interface Usuario {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    correo: string;
    password: string;
    estatus: boolean;
    rol:Rol;
}
