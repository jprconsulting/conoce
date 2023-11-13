import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Comunidad } from 'src/app/models/comunidad';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {
  private apiUrl = 'https://localhost:7154/api/comunidad';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  getComunidades(): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(`${this.apiUrl}/obtener_comunidades`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  agregarComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.http.post<Comunidad>(`${this.apiUrl}/agregar_comunidad`, comunidad).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  eliminarComunidad(comunidadId: number): Observable<any> {
    const url = `${this.apiUrl}/eliminar_comunidad/${comunidadId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  editarComunidad(comunidad: Comunidad): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar_comunidad`, comunidad).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
