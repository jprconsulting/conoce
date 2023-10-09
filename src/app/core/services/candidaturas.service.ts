import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidaturasService {
  route = `${environment.apiUrl}/candidatura`;
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
  postCandidaturas(partidos: Partidos): Observable<Partidos> {
    return this.http.post<Partidos>(`${this.route}/agregar_candidatura`, partidos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
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
