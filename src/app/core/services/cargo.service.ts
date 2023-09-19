import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Cargos } from 'src/app/models/cargos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  route = `${environment.apiUrl}/cargo`;
  private _refreshLisUsers$ = new Subject<Cargos | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getCargos(): Observable<Cargos[]> {
    return this.http.get<Cargos[]>(`${this.route}/obtener_cargos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  postCargo(cargos: Cargos): Observable<Cargos> {
    return this.http.post<Cargos>(`${this.route}/agregar_cargo`, cargos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteCrago(id: number) {
    return this.http.delete(`${this.route}/eliminar_cargo?id=${id}`)
    .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putCargo(cargos: Cargos): Observable<Cargos> {
    return this.http.put<Cargos>(`${this.route}/editar_cargo`, cargos)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }



}
