import { Ayuntamiento } from "./ayuntamiento";

export interface Comunidad {
  id: number;
  nombre: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  ayuntamiento: Ayuntamiento;
}
