import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Diseño } from 'src/app/models/diseño';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalizacionService {
  private apiUrl = `${environment.apiUrl}/personalizacion`;

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  // Función para guardar la configuración (imágenes, enlaces, colores)
  guardarConfiguracion(configuracion: Diseño): Observable<Diseño> {
    const url = `${this.apiUrl}/agregar_personalizacion`;
    return this.http.post<Diseño>(url, configuracion).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  obtenerConfiguracion(): Observable<Diseño> {
    const url = `${this.apiUrl}/configuracion`;
    return this.http.get<Diseño>(url).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
