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
  route = `${environment.apiUrl}/usuarios_registro`;
  private _refreshLisUsers$ = new Subject<Candidato>();


  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getCandidatos(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.route).pipe(map((response: any) => response.response));
  }

  postCandidatos(usuario: Candidato): Observable<Candidato> {
    return this.http.post<Candidato>(this.route, usuario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteCandidatos(id: string) {
    return this.http.delete(`${this.route}/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }



}
