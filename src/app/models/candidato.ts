import { Estado } from "./estado";
import { Cargo } from "./cargos";
import { DistritoLocal } from "./distritoLocal";
import { Municipio } from "./municipio";
import { Comunidad } from "./comunidad";
import { Genero } from "./genero";
import { AgrupacionPolitica } from "./agrupacion-politica";

export interface Candidato {
  id: number;
  nombres: string;
  nombreCompleto: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sobrenombre: string;
  nombreSuplente: string;
  fechaNacimiento: string;
  direccionCasaCampania: string;
  telefonoPublico: string;
  email: string;
  paginaWeb: string;
  facebook: string;
  twitter: string;
  instagram: string;
  tiktok: string;
  foto: string;
  estatus: boolean;
  agrupacionPolitica: AgrupacionPolitica;
  cargo: Cargo;
  estado: Estado;
  genero: Genero;
  distritoLocal: DistritoLocal;
  municipio: Municipio;
  comunidad: Comunidad;
  tieneRespuestas: boolean;
}



