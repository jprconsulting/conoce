import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Ayuntamiento } from 'src/app/models/ayuntamiento';

@Injectable({
  providedIn: 'root',
})

export class AyuntamientoService {
  private apiUrl = 'https://localhost:7154/api/ayuntamiento';
  private _isLoadingUsers = false;
  private _refreshListUsers$ = new Subject<Ayuntamiento | null>();
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
  getAyuntamientos(): Observable<Ayuntamiento[]> {
    this.isLoadingUsers = true;
    return this.http.get<Ayuntamiento[]>(`${this.apiUrl}/obtener_ayuntamientos`).pipe(
      catchError((error) => {
        this.isLoadingUsers = false;
        return this.handleErrorService.handleError(error);
      }),
      tap(() => {
        this.isLoadingUsers = false;
      })
    );
  }
  postAyuntamiento(ayuntamiento: Ayuntamiento): Observable<Ayuntamiento> {
    return this.http.post<Ayuntamiento>(`${this.apiUrl}/agregar_ayuntamiento`, ayuntamiento).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  deleteAyuntamiento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar_ayuntamiento/${id}`).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  putAyuntamiento(ayuntamiento: Ayuntamiento): Observable<Ayuntamiento> {
    return this.http.put<Ayuntamiento>(`${this.apiUrl}/editar_ayuntamiento`, ayuntamiento).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
}
