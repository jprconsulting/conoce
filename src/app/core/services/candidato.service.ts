import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Candidato } from 'src/app/models/candidato';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private getCandidatosRoute = `${environment.apiUrl}/obetener_candidatos`;
  private postCandidatosRoute = `${environment.apiUrl}/agregar_candidato`;
  private deleteCandidatosRoute = `${environment.apiUrl}/eliminar_candidato`;
  private _refreshLisUsers$ = new Subject<Candidato>();
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }
  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.getCandidatosRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  postCandidatos(usuario: Candidato): Observable<Candidato> {
    return this.http.post<Candidato>(this.postCandidatosRoute, usuario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  deleteCandidatos(id: string) {
    return this.http.delete<Candidato>(this.deleteCandidatosRoute)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}