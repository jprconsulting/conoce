import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioAsignadoService {
  route = `${environment.apiUrl}/formulario-usuario`;

  constructor(private http: HttpClient) {}

  obtenerFormulariosAsignados(formularioId: number) {
    return this.http.get(`${this.route}/get-formulario-usuario/${formularioId}`);
  }
}
