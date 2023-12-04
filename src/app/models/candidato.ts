export interface Candidato {
  candidatoId: number;
  nombre: string;
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
  cargoId: number;
  estadoId: number;
  distritoLocalId: number;
  ayuntamientoId: number;
  comunidadId: number;
  generoId: number;
  candidaturaId: number;
  candidatura: any;
  cargo: any;
  estado: any;
  genero: any;

  tieneRespuestas: boolean;

}



