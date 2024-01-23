import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TiposCand } from 'src/app/models/tiposcandidaturas';
import { AgrupacionPolitica } from 'src/app/models/agrupacion-politica';

@Injectable({
  providedIn: 'root'
})
export class AgrupacionService {
  route = `${environment.apiUrl}/agrupaciones-politicas`;
  private _refreshLisUsers$ = new Subject<AgrupacionPolitica | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

 
  getCandidaturas2(): Observable<AgrupacionPolitica[]> {
    return this.http.get<AgrupacionPolitica[]>(`${this.route}/obtener-todos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  postCandidaturas(candidaturas: AgrupacionPolitica): Observable<AgrupacionPolitica> {
    return this.http.post<AgrupacionPolitica>(`${this.route}/crear`, candidaturas)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  gettipos(): Observable<TiposCand[]> {
    return this.http.get<TiposCand[]>(`${environment.apiUrl}/tipos-organizaciones-politicas/obtener-todos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  putCandidatura(id:number,candidaturas: AgrupacionPolitica): Observable<AgrupacionPolitica> {
    return this.http.put<AgrupacionPolitica>(`${this.route}/actualizar/${id}`, candidaturas)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.route}/eliminar/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }  
}