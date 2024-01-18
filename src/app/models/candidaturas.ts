import { TipoCandidatura } from "./tipocandidatura";

export interface Candidaturas {
  id:number;
  nombreOrganizacion: string;
  acronimo:string;
  imagenBase64: string;
  estatus: boolean;
  tipoOrganizacionPolitica: TipoCandidatura;
  logo: string;
}
