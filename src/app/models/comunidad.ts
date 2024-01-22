import { Municipio } from "./municipio";

export interface Comunidad {
  id: number;
  nombreComunidad: string;
  municipio: Municipio;
}
