export interface DistritoLocal {
  id: number;
  nombre: string;
  acronimo: string;
  estatus: boolean;
  peticion: string;
  estado: Estados;
}

export interface Estados{
  id:number;
  nombreEstado:string;
}
