import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Usuario } from 'src/app/models/usuario';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Rol } from 'src/app/models/Rol';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  route = `${environment.apiUrl}/usuario`;
  private apiUrl = 'https://localhost:7154/api';
  private _refreshLisUsers$ = new Subject<Usuario | null>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.route}/obtener_usuarios`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${environment.apiUrl}/roles/obtener_roles`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.route}/agregar_usuario`, usuario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.route}/eliminar_usuario/${id}`)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next;
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

  putUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.route}/editar_usuario`, usuario)
      .pipe(
        tap(() => {
          this._refreshLisUsers$.next(null);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }
  getPorId(id: number) {
    return this.http.get<Usuario>(`${this.route}/obtener_usuario/${id}`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  getUsuariosPorIds(ids: number[]): Observable<Usuario[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<Usuario[]>(`${this.route}/usuario/obtener_usuario`, { params })
      .pipe(
        catchError(this.handleErrorService.handleError)
      );
  }

  getUsuariosConFormulario(formularioId: number): Observable<any[]> {
    const url = `${this.apiUrl}/formulario-usuario/get-formulario-usuario/${formularioId}`;

    return this.http.get<any[]>(url);
  }
}
