import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Formuser } from 'src/app/models/formuser';

@Injectable({
  providedIn: 'root'
})
export class FormularioUserService {
  route = `${environment.apiUrl}/formulario-usuario`;
  private _refreshLisUsers$ = new Subject<Formuser>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  postFormulario(formuser: Formuser) {
    return this.http.post<Formuser>(`${this.route}/post-formulario-usuario`, formuser)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  getFormularios(): Observable<Formuser[]> {
    return this.http.get<Formuser[]>(`${this.route}/get-formulario-usuario`)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteFormulario(formularioId: number, usuarioId: number) {
    const url = `${this.route}/delete-formulario-usuario?formularioId=${formularioId}&usuarioId=${usuarioId}`;

    return this.http.delete(url)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putFormulario(data: { formularioId: number, usuarioIds: number[] }) {
    return this.http.post<Formuser>(`${this.route}/editar_usuario`, data)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

cargarUsuariosPorFormularioId(formularioId: number): Observable<Formuser[]> {
  const url = `${this.route}/get-formulario-usuarios/${formularioId}`;

  return this.http.get<Formuser[]>(url)
    .pipe(
      catchError(this.handleErrorService.handleError)
    );
}


}
