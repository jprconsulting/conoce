import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CandidaturasService {
  private partidosRoute = `${environment.apiUrl}/candidatura/obtener_candidaturas`;

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  obtenerPartidos(): Observable<Partidos[]> {
    return this.http.get<Partidos[]>(this.partidosRoute).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
