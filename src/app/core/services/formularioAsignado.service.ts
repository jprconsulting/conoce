import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioAsignadoService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://localhost:7154/api';

 cambiarEstatusFormulario(formularioUsuarioId: number) {
  const url = `${this.apiUrl}/EstatusFormulario/cambiar_estatus?formularioUsuarioId=${formularioUsuarioId}`;

  return this.http.post(url, {});
}

}
