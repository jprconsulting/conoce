import { DistritoLocal } from "./distritoLocal";

export interface Municipio {
  id: number;
  nombreMunicipio: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  distritoLocal: DistritoLocal;
}
