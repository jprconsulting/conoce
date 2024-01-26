import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Formulario } from 'src/app/models/formulario';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  route = `${environment.apiUrl}/formulario`;
  ruta = `${environment.apiUrl}/respuestas-google-form`;

  private _refreshListFormularios$ = new Subject<Formulario | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshListFormularios() {
    return this._refreshListFormularios$;
  }

  post(dto: Formulario) {
    return this.http.post<Formulario>(`${this.route}/crear`, dto)
      .pipe(
        tap(() => {
          this._refreshListFormularios$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  getAll(): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(`${this.route}/obtener-todos`)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  getFormulariosSinConfiguracion(): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(`${this.route}/obtener-formularios-sin-configuracion`)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.route}/eliminar/${id}`)
      .pipe(
        tap(() => {
          this._refreshListFormularios$;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  put(id: number, dto: Formulario) {
    return this.http.put<Formulario>(`${this.route}/actualizar/${id}`, dto)
      .pipe(
        tap(() => {
          this._refreshListFormularios$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  getRespuestas(id: number): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(`${this.ruta}/importar-respuestas-google-form/${id}`);
  }

}
