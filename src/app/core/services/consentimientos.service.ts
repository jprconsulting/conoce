import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import { Consentimiento } from 'src/app/models/consentimientos';
import { Email } from 'src/app/models/Email';



import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsentimientoService {
  private _refreshLisConsentimiento$ = new Subject<Consentimiento | null>();
  private _refreshLisemail$ = new Subject<Email | null>();
  route = `${environment.apiUrl}/consentimiento`;
  selectedEmails: any;
  enlaceEdicionUsuario2: string = '';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  get refreshLisEmail() {
    return this._refreshLisemail$;
  }
  getEmail():Observable<Email[]> {
    return this.http.get<Email[]>(`${environment.apiUrl}/correo/obtener_correo`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  get refreshLisConsentimiento() {
    return this._refreshLisConsentimiento$;
  }
  getConsentimiento():Observable<Consentimiento[]> {
    return this.http.get<Consentimiento[]>(`${this.route}/obtener_consentimiento`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  postConsentimiento(consentimiento: Consentimiento): Observable<Consentimiento> {
    return this.http.post<Consentimiento>(`${this.route}/agregar_consentimiento`, consentimiento)
      .pipe(
        tap(() => {
          this._refreshLisConsentimiento$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
        
      );
  }
  deleteConsentimiento(id: number) {
    return this.http.delete(`${this.route}/eliminar_consentimiento/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisConsentimiento$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  putConsentimiento(consentimiento: Consentimiento): Observable<Consentimiento> {
    return this.http.put<Consentimiento>(`${this.route}/editar_consentimiento`, consentimiento)
      .pipe(
        tap(() => {
          this._refreshLisConsentimiento$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  enviarConsentimientos(email: string, id: number, selectedEmails: string[]) {
    const encodedEmail = encodeURIComponent(email);
    SelectedEmails: selectedEmails
  return this.http.post<Consentimiento>(`${this.route}/obtenercorreos?EmailOrigen=${encodedEmail}&id=${id}`, selectedEmails)
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
getId(): number | null {
  const Id = localStorage.getItem('Id');
  return Id ? parseInt(Id, 10) : null;
}
getConsentimientoPorId(id: number) {
  return this.http.get<Consentimiento>(`${this.route}/datos/${id}`).pipe(
    catchError(this.handleErrorService.handleError)
  );
}

}
  
  
  
