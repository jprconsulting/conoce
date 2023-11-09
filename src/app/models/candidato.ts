export interface Candidato {
    edad: string;
    candidatoId : number;
    nombrePropietario : string;
    sobrenombrePropietario : string;
    nombreSuplente : string;
    fechaNacimiento : FechaNacimiento;
    direccionCasaCampania : string;
    telefonoPublico: string;
    email : string;
    paginaWeb : string;
    facebook : string;
    twitter : string;
    instagram : string;
    tiktok : string;
    foto : string;
    estatus : boolean;
    cargoId : number;
    estadoId : number;
    generoId : number;
    candidaturaId : number;
    logo: string;
    }
    export interface FechaNacimiento {
      year: number;
      month: number;
      day: number;
      dayOfWeek: number;
      dayOfYear: number;
      dayNumber: number;
    }