import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Estados } from 'src/app/models/estados';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Candidaturas} from 'src/app/models/candidaturas';
import {Cargos} from 'src/app/models/cargos';
import {Genero} from 'src/app/models/genero';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private estadosRoute = `${environment.apiUrl}/estados/obtener-todos`;
  private candidaturasRoute = `${environment.apiUrl}/tipos-organizaciones-politicas/obtener-todos`;
  private cargoRoute = `${environment.apiUrl}/cargos/obtener-todos`;
  private genRoute = `${environment.apiUrl}/generos/obtener-todos`;
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  obtenerEstados(): Observable<Estados[]> {
    return this.http.get<Estados[]>(this.estadosRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  obtenerCandidaturas(): Observable<Candidaturas[]> {
    return this.http.get<Candidaturas[]>(this.candidaturasRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  obtenerCargos(): Observable<Cargos[]> {
    return this.http.get<Cargos[]>(this.cargoRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  obtenerGeneros(): Observable<Genero[]> {
    return this.http.get<Genero[]>(this.genRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

}
