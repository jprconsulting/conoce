import { Estados } from "./estados";

export interface DistritoLocal {
  id: number;
  nombre: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  estado: Estados;
}

