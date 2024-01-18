import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TipoCandidatura } from 'src/app/models/tipocandidatura';
import { Candidaturas } from 'src/app/models/candidaturas';

@Injectable({
  providedIn: 'root'
})
export class CandidaturasService {
  route = `${environment.apiUrl}/agrupaciones-politicas`;
  private _refreshLisUsers$ = new Subject<Partidos | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getCandidaturas(): Observable<Partidos[]> {
    return this.http.get<Partidos[]>(`${this.route}/obtener_candidaturas`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  postCandidaturas(candidaturas: Candidaturas): Observable<Candidaturas> {
    return this.http.post<Candidaturas>(`${this.route}/crear`, candidaturas)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  gettipos(): Observable<TipoCandidatura[]> {
    return this.http.get<TipoCandidatura[]>(`${environment.apiUrl}/tipos-organizaciones-politicas/obtener-todos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  putCandidatura(partidos: Partidos): Observable<Partidos> {
    return this.http.put<Partidos>(`${this.route}/editar_candidatura`, partidos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
