import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Ayuntamiento } from 'src/app/models/ayuntamiento';

@Injectable({
  providedIn: 'root'
})
export class AyuntamientoService {
  private apiUrl = 'https://localhost:7154/api/ayuntamiento';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  getAyuntamientos(): Observable<Ayuntamiento[]> {
    return this.http.get<Ayuntamiento[]>(`${this.apiUrl}/obtener_ayuntamientos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  postAyuntamiento(ayuntamientoData: Ayuntamiento): Observable<Ayuntamiento> {
    return this.http.post<Ayuntamiento>(`${this.apiUrl}/agregar_ayuntamiento`, ayuntamientoData).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  eliminarAyuntamiento(ayuntamientoId: number): Observable<any> {
    const url = `${this.apiUrl}/eliminar_ayuntamiento/${ayuntamientoId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  editarAyuntamiento(ayuntamiento: Ayuntamiento): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar_ayuntamiento`, ayuntamiento).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
