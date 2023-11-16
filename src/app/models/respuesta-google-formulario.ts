export interface PreguntaRespuesta {
  preguntaCuestionarioId: number;
  pregunta: string;
  respuestaPreguntaCuestionarioid: number;
  respuesta: string;
}

export interface Formulario {
  formularioId: number;
  formName: string;
  googleFormId: string;
  preguntasRespuestas: PreguntaRespuesta[];
}

export interface RespuestaGoogleFormulario {
  candidatoId: number;
  nombre: string;
  formularios: Formulario[];
}

export interface EstadoFormulario {
  formulario: string;
  estado: string;
}
