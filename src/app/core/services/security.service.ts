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
    return this.http.post(`${this.route}`, entity)
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

  hasClaim(cliamType: any, claimValue?: any) {
    let ret: boolean = false;

    if (typeof cliamType === 'string') {
      ret = this.isClaimValid(cliamType, claimValue);
    } else {
      let claims: string[] = cliamType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }


  isClaimValid(cliamType: string, claimValue?: string) {
    let ret: boolean = false;
    const auth = this.getDataUser();
    if (auth) {
      if (cliamType.indexOf(':') >= 0) {
        let words: string[] = cliamType.split(':');
        cliamType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        cliamType = cliamType.toLowerCase();
        claimValue = claimValue ? claimValue : 'true';
      }
      ret = auth.claims.find(c => c.claimType.toLowerCase() == cliamType && c.claimValue.toString() == claimValue) != null;
    }

    return ret;
  }

  getDataUser(): AppUserAuth | null {
    const data = localStorage.getItem('dataObject');
    if (data) {
      const _dataObject: AppUserAuth = JSON.parse(data);
      return _dataObject;
    } else {
      return null;
    }
  }





}
