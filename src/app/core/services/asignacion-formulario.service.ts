import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AsignacionFormulario } from 'src/app/models/asignacion-formulario';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';

@Injectable({
  providedIn: 'root'
})
export class AsignacionFormularioService {

  route = `${environment.apiUrl}/asignaciones-formulario`;
  private _refreshListAsignaciones$ = new Subject<AsignacionFormulario | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshListAsignaciones() {
    return this._refreshListAsignaciones$;
  }

  getById(id: number) {
    return this.http.get<AsignacionFormulario>(`${this.route}/obtener-por-id/${id}`);
  }

  getByCandidatoEmail(email: string): Observable<AsignacionFormulario[]> {
    return this.http.get<AsignacionFormulario[]>(`${this.route}/obtener-por-candidato-email?email=${email}`);
  }
  
  getAll() {
    return this.http.get<AsignacionFormulario[]>(`${this.route}/obtener-todos`);
  }

  post(dto: AsignacionFormulario) {
    return this.http.post<AsignacionFormulario>(`${this.route}/crear`, dto)
      .pipe(
        tap(() => {
          this._refreshListAsignaciones$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  put(id: number, dto: AsignacionFormulario) {
    return this.http.put<AsignacionFormulario>(`${this.route}/actualizar/${id}`, dto)
      .pipe(
        tap(() => {
          this._refreshListAsignaciones$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.route}/eliminar/${id}`)
      .pipe(
        tap(() => {
          this._refreshListAsignaciones$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
