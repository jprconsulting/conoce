import { Municipio } from "./municipio";

export interface Comunidad {
  id: number;
  nombre: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  municipio: Municipio;
}
