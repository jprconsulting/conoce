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
  route = `${environment.apiUrl}/candidato`;
  private _refreshLisUsers$ = new Subject<Candidato[] | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(`${this.route}/obtener_candidatos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  postCandidatos(candidatos: Candidato[]): Observable<Candidato[]> {
    return this.http.post<Candidato[]>(`${this.route}/agregar_candidato`, candidatos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteCandidatos(id: number) {
    return this.http.delete(`${this.route}/eliminar_usuario/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putCandidatos(candidatos: Candidato[]): Observable<Candidato[]> {
    return this.http.put<Candidato[]>(`${this.route}/editar_usuario`, candidatos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
