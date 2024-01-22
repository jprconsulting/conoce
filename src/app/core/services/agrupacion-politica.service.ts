import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AgrupacionPolitica } from 'src/app/models/agrupacion-politica';

@Injectable({
  providedIn: 'root'
})
export class AgrupacionPoliticaService {
  route = `${environment.apiUrl}/agrupaciones-politicas`;
  private _refreshListAgrupacionesPoliticas$ = new Subject<AgrupacionPolitica | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshListAgrupacionesPoliticas() {
    return this._refreshListAgrupacionesPoliticas$;
  }

  getById(id: number) {
    return this.http.get<AgrupacionPolitica>(`${this.route}/obtener-por-id/${id}`);
  }

  getAgrupacionesPoliticas() {
    return this.http.get<AgrupacionPolitica[]>(`${this.route}/obtener-todos`);
  }

  post(dto: AgrupacionPolitica) {
    return this.http.post<AgrupacionPolitica>(`${this.route}/crear`, dto)
      .pipe(
        tap(() => {
          this._refreshListAgrupacionesPoliticas$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  put(id: number, dto: AgrupacionPolitica) {
    return this.http.put<AgrupacionPolitica>(`${this.route}/actualizar/${id}`, dto)
      .pipe(
        tap(() => {
          this._refreshListAgrupacionesPoliticas$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.route}/eliminar/${id}`)
      .pipe(
        tap(() => {
          this._refreshListAgrupacionesPoliticas$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
