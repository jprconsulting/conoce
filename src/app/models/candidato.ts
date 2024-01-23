import { Estado } from "./estado";
import { Cargos } from "./cargos";
import { DistritoLocal } from "./distritoLocal";
import { Municipio } from "./municipio";
import { Comunidad } from "./comunidad";
import { Genero } from "./genero";
import { AgrupacionPolitica } from "./agrupacion-politica";

export interface Candidato {
  id: number;
  nombre: string;
  nombreCompleto: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sobrenombrePropietario: string;
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
  cargo: Cargos;
  estado: Estado;
  distritoLocal: DistritoLocal;
  municipio: Municipio;
  comunidad: Comunidad;
  genero: Genero;
  agrupacion: AgrupacionPolitica;

  tieneRespuestas: boolean;

}



