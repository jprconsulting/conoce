import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Estados } from 'src/app/models/estados';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Candidaturas} from 'src/app/models/candidaturas';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private apiUrl = 'https://mocki.io/v1/42f19424-fae5-41e5-9785-0fc68bad139a';
  private candUrl ='https://mocki.io/v1/decb48f3-ce22-4b36-a759-9548204206ce';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  obtenerEstados(): Observable<Estados[]> {
    return this.http.get<Estados[]>(this.apiUrl).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  obtenerCandidaturas(): Observable<Candidaturas[]> {
    return this.http.get<Candidaturas[]>(this.candUrl).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
