import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Cargo } from 'src/app/models/cargos';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  route = `${environment.apiUrl}/cargos`;
  private _refreshListCargos$ = new Subject<Cargo | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshListCargos$;
  }

  getCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.route}/obtener-todos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  post(cargos: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(`${this.route}/crear`, cargos)
      .pipe(
        tap(() => {
          this._refreshListCargos$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.route}/eliminar/${id}`)
      .pipe(
        tap(() => {
          this._refreshListCargos$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  put(id: number, dto: Cargo) {
    return this.http.put<Cargo>(`${this.route}/actualizar/${id}`, dto)
      .pipe(
        tap(() => {
          this._refreshListCargos$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
}
