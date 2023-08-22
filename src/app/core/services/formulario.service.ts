import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Formulario } from 'src/app/models/formulario';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  route = `${environment.apiUrl}/usuarios_registro`;
  private _refreshLisUsers$ = new Subject<Formulario>();


  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getFormulario(): Observable<Formulario[]> {
    return this.http.get<Formulario[]>(this.route).pipe(map((response: any) => response.response));
  }

  postFormulario(formulario: Formulario): Observable<Formulario> {
    return this.http.post<Formulario>(this.route, formulario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteFormulario(id: string) {
    return this.http.delete(`${this.route}/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }



}
