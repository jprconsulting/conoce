import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { AppUser, AppUserAuth } from 'src/app/models/login';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  route = `${environment.apiUrl}/Autenticar`;
  dataObject!: AppUserAuth;


  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService,

  ) { }

  login(entity: AppUser) {
    localStorage.removeItem('dataObject');
    localStorage.removeItem('token');
    return this.http.post(`${this.route}/Autenticar`, entity)
      .pipe(
        tap((resp: any) => {
          this.dataObject = resp;
          localStorage.setItem('dataObject', resp);
          localStorage.setItem('token', this.dataObject.token);
        }),
        catchError(this.handleErrorService.handleError)
      )
  }

  logout() {
    localStorage.removeItem('dataObject');
    localStorage.removeItem('token');
  }



}
