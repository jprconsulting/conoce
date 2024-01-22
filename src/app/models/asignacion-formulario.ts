import { Candidato } from "./candidato";
import { Formulario } from "./formulario";

export interface AsignacionFormulario {
    id: number;
    editLink: string;
    estatus: boolean;
    strFechaHoraAsignacion: string;
    formulario: Formulario;
    candidato: Candidato;
    candidatosIds: number[]
}
