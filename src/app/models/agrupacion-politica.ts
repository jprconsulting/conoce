
export interface AgrupacionPolitica {
  id:number;
  nombreAgrupacion: string;
  acronimo:string;
  imagenBase64: string;
  estatus: boolean;
  tipoAgrupacionPolitica: TipoAgrupacionPolitica;
  logo: string;
}

export interface TipoAgrupacionPolitica {
  id: number;
  tipoAgrupacion: number;
}
