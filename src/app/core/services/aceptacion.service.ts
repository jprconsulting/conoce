import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { Aceptacion } from 'src/app/models/aceptacion';



import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AceptacionService {
  route = `${environment.apiUrl}/aceptacion`;
  selectedEmails: any;
  enlaceEdicionUsuario2: string = '';
  private _refreshLisAceptacion$ = new Subject<Aceptacion | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  postAceptacion(aceptacion: Aceptacion): Observable<Aceptacion> {
    return this.http.post<Aceptacion>(`${this.route}/agregar_aceptacion`, aceptacion)
      .pipe(
        tap(() => {
          
        }),
        catchError(this.handleErrorService.handleError)
        
      );
  }
  get refreshLisAceptacion() {
    return this._refreshLisAceptacion$;
  }
  getAceptacion():Observable<Aceptacion[]> {
    return this.http.get<Aceptacion[]>(`${this.route}/obtener_aceptacion`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  putAceptacion(result: Aceptacion): Observable<Aceptacion> {
    return this.http.put<Aceptacion>(`${this.route}/editar_aceptacion`, result)
      .pipe(
        tap(() => {
          this._refreshLisAceptacion$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  deleteAceptacion(id: number) {
    return this.http.delete(`${this.route}/eliminar_aceptacion/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisAceptacion$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  getAceptacionPorEmail(email: string) {
    return this.http.get<Aceptacion>(`${this.route}/obtener/${email}`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}