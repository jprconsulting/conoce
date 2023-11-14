import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ConfigGoogleForm } from 'src/app/models/googleForm';
import { RespuestaGoogleFormulario } from 'src/app/models/respuesta-google-formulario';

@Injectable({
  providedIn: 'root'
})
export class RespuestasGoogleService {
  private apiUrl = `${environment.apiUrl}/`; // Asegúrate de tener la propiedad apiUrl definida en tu environment

  private _refreshLisUsers$ = new Subject<ConfigGoogleForm[]>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  enviarGoogleFormIds(googleFormIds: string[]): Observable<any> {
    const url = `${this.apiUrl}/`;
    const data = { googleFormIds };

    return this.http.post(url, data).pipe(
      tap(() => {
      }),
      catchError(this.handleErrorService.handleError)
    );
  }

  obtenerRespuestasPorCandidatoId(candidatoId: number): Observable<RespuestaGoogleFormulario> {
    const url = `${this.apiUrl}respuestas-google-formulario/respuestas-preguntas-google-form-por-candidato-id/${candidatoId}`;
    return this.http.get<RespuestaGoogleFormulario>(url).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
