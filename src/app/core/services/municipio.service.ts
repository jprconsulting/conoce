import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Municipio } from 'src/app/models/municipio';

@Injectable({
  providedIn: 'root',
})

export class MunicipioService {
  private apiUrl = 'https://localhost:7224/api/municipios';
  private _isLoadingUsers = false;
  private _refreshListUsers$ = new Subject<Municipio | null>();
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  get isLoadingUsers() {
    return this._isLoadingUsers;
  }
  set isLoadingUsers(value: boolean) {
    this._isLoadingUsers = value;
  }
  get refreshListUsers() {
    return this._refreshListUsers$;
  }
  getMunicipios(): Observable<Municipio[]> {
    this.isLoadingUsers = true;
    return this.http.get<Municipio[]>(`${this.apiUrl}/obtener-todos`).pipe(
      catchError((error) => {
        this.isLoadingUsers = false;
        return this.handleErrorService.handleError(error);
      }),
      tap(() => {
        this.isLoadingUsers = false;
      })
    );
  }
  postAyuntamiento(ayuntamiento: Municipio): Observable<Municipio> {
    return this.http.post<Municipio>(`${this.apiUrl}/crear`, ayuntamiento).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  deleteAyuntamiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  putAyuntamiento(id: number,ayuntamiento: Municipio): Observable<Municipio> {
    return this.http.put<Municipio>(`${this.apiUrl}/actualizar/${id}`, ayuntamiento).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
}
