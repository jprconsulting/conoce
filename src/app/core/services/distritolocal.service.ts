import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';

@Injectable({
  providedIn: 'root',
})

export class DistritoLocalService {
  private apiUrl = 'https://localhost:7224/api/distritos';
  private _isLoadingUsers = false;
  private _refreshListUsers$ = new Subject<DistritoLocal | null>();
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
  getDistritosLocales(): Observable<DistritoLocal[]> {
    this.isLoadingUsers = true;
    return this.http.get<DistritoLocal[]>(`${this.apiUrl}/obtener-todos`).pipe(
      catchError((error) => {
        this.isLoadingUsers = false;
        return this.handleErrorService.handleError(error);
      }),
      tap(() => {
        this.isLoadingUsers = false;
      })
    );
  }
  postDistritoLocal(distritoLocal: DistritoLocal): Observable<DistritoLocal> {
    return this.http.post<DistritoLocal>(`${this.apiUrl}/crear`, distritoLocal).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  deleteDistritoLocal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
  putDistritoLocal(id: number,distritoLocal: DistritoLocal): Observable<DistritoLocal> {
    return this.http.put<DistritoLocal>(`${this.apiUrl}/actualizar/${id}`, distritoLocal).pipe(
      catchError(this.handleErrorService.handleError),
      tap(() => {
        this._refreshListUsers$.next(null);
      })
    );
  }
}
