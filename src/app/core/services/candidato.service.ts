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

  postCandidato(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.route}/agregar_candidato`, formData);
  }

  deleteCandidatos(id: number) {
    return this.http.delete(`${this.route}/eliminar_candidato/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putCandidato(candidato: Candidato): Observable<Candidato> {
    return this.http.put<Candidato>(`${this.route}/actualizar_candidato/${candidato.candidatoId}`, candidato)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

}
