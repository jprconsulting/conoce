import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Email } from 'src/app/models/Email';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private getEmailRoute ='';
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }
  getEmail():Observable<Email[]> {
    return this.http.get<Email[]>(this.getEmailRoute).pipe(
    );
  }
  postEmail(email: Email): Observable<Email> {
    return this.http.post<Email>(this.getEmailRoute, email)
    .pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}

