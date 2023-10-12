import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ConfigGoogleForm } from 'src/app/models/googleForm';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  route = `${environment.apiUrl}/config-google-form`;
  private _refreshLisUsers$ = new Subject<ConfigGoogleForm>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  postFormulario(formData: ConfigGoogleForm) {
    return this.http.post<ConfigGoogleForm>(`${this.route}/post-config-google-forms`, formData)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  getFormularios(): Observable<ConfigGoogleForm[]> {
    return this.http.get<ConfigGoogleForm[]>(`${this.route}/get-config-google-forms`)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteFormulario(formularioId: number) {
    return this.http.delete(`${this.route}/eliminar_formulario/${formularioId}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putFormulario(configForm: ConfigGoogleForm): Observable<ConfigGoogleForm> {
    return this.http.put<ConfigGoogleForm>(`${this.route}/actualizar-formulario`, configForm)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
