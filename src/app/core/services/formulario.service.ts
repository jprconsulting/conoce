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
  private agregarFormularioRoute = `${environment.apiUrl}/agregar_formulario`;
  // private agregarFormularioRoute = '/api/agregar_formulario';
  private obtenerTablasFormularioRoute = `${environment.apiUrl}/obtener_tablas_formulario`;
  private _refreshLisUsers$ = new Subject<ConfigGoogleForm>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  postFormulario(formData: ConfigGoogleForm) {
    return this.http.post<ConfigGoogleForm>(this.agregarFormularioRoute, formData)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  getFormularios(): Observable<ConfigGoogleForm[]> {
    return this.http.get<ConfigGoogleForm[]>(this.obtenerTablasFormularioRoute)
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }
}
