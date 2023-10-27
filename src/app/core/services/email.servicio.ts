import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Email } from 'src/app/models/Email';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { Mensaje } from 'src/app/models/Mensaje';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private _refreshLisemail$ = new Subject<Email | null>();
  route = `${environment.apiUrl}/correo`;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  get refreshLisEmail() {
    return this._refreshLisemail$;
  }
  getEmail():Observable<Email[]> {
    return this.http.get<Email[]>(`${this.route}/obtener_correo`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  postEmail(email: Email): Observable<Email> {
    return this.http.post<Email>(`${this.route}/agregar_correo`, email)
      .pipe(
        tap(() => {
          this._refreshLisemail$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
        
      );
  }
  deleteEmail(id: number) {
    return this.http.delete(`${this.route}/eliminar_correo/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisemail$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  putEmail(email: Email): Observable<Email> {
    return this.http.put<Email>(`${this.route}/editarcorreo`, email)
      .pipe(
        tap(() => {
          this._refreshLisemail$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  enviarEmail(id: number, EmailDestino: string, Mensaje: string): Observable<any> {
    return this.http.post<any>(`${this.route}/obtenercorreos/${id}?EmailDestino=${EmailDestino}&Mensaje=${Mensaje}`, Mensaje)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(error.error); 
          } else {
            return throwError('Error inesperado al enviar el correo electrónico');
          }
        })
      );
  }
  




}


  