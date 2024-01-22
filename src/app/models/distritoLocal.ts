import { Estado } from "./estado";

export interface DistritoLocal {
  id: number;
  nombreDistritoLocal: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  estado: Estado;
}

