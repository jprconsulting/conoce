import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { CandidatosMaqu } from 'src/app/models/candidatosmaq';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CandidatoService {
  private getCandidatosRoute = 'https://mocki.io/v1/27992203-0efc-4eeb-bc49-5c0168dc6d75';
  // private postCandidatosRoute = `${environment.apiUrl}/agregar_candidato`;
  // private deleteCandidatosRoute = `${environment.apiUrl}/eliminar_candidato`;
  // private _refreshLisUsers$ = new Subject<CandidatosMaqu>();
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  // get refreshLisUsers() {
  //   return this._refreshLisUsers$;
  // }
  getCandidatos(): Observable<CandidatosMaqu[]> {
    return this.http.get<CandidatosMaqu[]>(this.getCandidatosRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  // postCandidatos(usuario: Candidato): Observable<Candidato> {
  //   return this.http.post<Candidato>(this.postCandidatosRoute, usuario)
  //     .pipe(
  //       tap(() => {
  //         this._refreshLisUsers$.next;
  //       }),
  //       catchError(this.handleErrorService.handleError)
  //     );
  // }
  // deleteCandidatos(id: string) {
  //   return this.http.delete<Candidato>(this.deleteCandidatosRoute)
  //     .pipe(
  //       tap(() => {
  //         this._refreshLisUsers$.next;
  //       }),
  //       catchError(this.handleErrorService.handleError)
  //     );
  // }
}
