import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Diseño } from 'src/app/models/diseño';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalizacionService {
  route = `${environment.apiUrl}/usuarios_registro`;
  private _refreshLisUsers$ = new Subject<Diseño>();


  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getFormulario(): Observable<Diseño[]> {
    return this.http.get<Diseño[]>(this.route).pipe(map((response: any) => response.response));
  }

  postFormulario(formulario: Diseño): Observable<Diseño> {
    return this.http.post<Diseño>(this.route, formulario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteFormulario(id: string) {
    return this.http.delete(`${this.route}/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }



}
