import { DistritoLocal } from "./distritoLocal";

export interface Ayuntamiento {
  id: number;
  nombre: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  distritoLocal: DistritoLocal;
}
