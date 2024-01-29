import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { AppUser, AppUserAuth, FormulariosAsignados } from 'src/app/models/login';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AsignacionFormulario } from 'src/app/models/asignacion-formulario';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  route = `${environment.apiUrl}/auth`;
  private apiUrl = 'https://localhost:7154/api';

  dataObject!: AppUserAuth;
  asignacionFormulario: AsignacionFormulario[] = [];

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  login(entity: AppUser) {
    localStorage.removeItem('dataObject');
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('formulariosAsignados');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
  
    return this.http.post<AppUserAuth>(`${this.route}/login`, entity)
      .pipe(
        tap((resp: AppUserAuth) => {
          this.dataObject = resp;
          localStorage.setItem('dataObject', JSON.stringify(this.dataObject));
          localStorage.setItem('token', this.dataObject.token);
          localStorage.setItem('usuarioId', this.dataObject.usuarioId.toString());
          localStorage.setItem('nombreCompleto', this.dataObject.nombre);
          localStorage.setItem('email', this.dataObject.email);
          localStorage.setItem('rol', this.dataObject.rol);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  logout() {
    localStorage.removeItem('dataObject');
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('formulariosAsignados');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('email');
    localStorage.removeItem('rol');
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

  getUsuarioId(): number | null {
    const usuarioId = localStorage.getItem('usuarioId');
    return usuarioId ? parseInt(usuarioId, 10) : null;
  }

  getNombre(): string | null {
    return localStorage.getItem('nombreCompleto');
  }
  
  getRol(): string | null {
    return localStorage.getItem ('rol')
  }

    getEmail(): string | null {
    return localStorage.getItem ('email')
  }

  getFormulariosAsignados(email: string): Observable<AsignacionFormulario[]> {
    const url = `${environment.apiUrl}/asignaciones-formulario/obtener-por-candidato-email/${email}`;
    return this.http.get<AsignacionFormulario[]>(url);
  }
  
getUsuariosConFormulario(formularioId: number): Observable<any[]> {
  const url = `${this.apiUrl}/formulario-usuario/get-formulario-usuario/${formularioId}`;

  return this.http.get<any[]>(url);
}
}
