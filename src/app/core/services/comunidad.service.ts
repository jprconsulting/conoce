import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { Comunidad } from 'src/app/models/comunidad';

@Injectable({
  providedIn: 'root',
})

export class ComunidadService {
  private apiUrl = 'https://localhost:7154/api/comunidad';
  private _isLoadingUsers = false;
  private _refreshListUsers$ = new Subject<Comunidad | null>();
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
  getComunidades(): Observable<Comunidad[]> {
    this.isLoadingUsers = true;
    return this.http.get<Comunidad[]>(`${this.apiUrl}/obtener_comunidades`).pipe(
      catchError((error) => {
        this.isLoadingUsers = false;
        return this.handleErrorService.handleError(error);
      }),
      tap(() => {
        this.isLoadingUsers = false;
      })
    );
  }
  agregarComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.http.post<Comunidad>(`${this.apiUrl}/agregar_comunidad`, comunidad).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  eliminarComunidad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar_comunidad/${id}`).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  editarComunidad(comunidad: Comunidad): Observable<Comunidad> {
    return this.http.put<Comunidad>(`${this.apiUrl}/editar_comunidad`, comunidad).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
}
