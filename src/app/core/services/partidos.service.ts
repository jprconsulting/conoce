import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Partidos } from 'src/app/models/partidos';
import { Coaliciones } from 'src/app/models/coaliciones';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = 'https://mocki.io/v1/04d093df-4b09-4edf-8541-7acb11d3de03';
  private apiUrlCoa = 'https://mocki.io/v1/af888585-4b5d-49ab-b29a-38a014d20991';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  obtenerPartidos(): Observable<Partidos[]> {
    return this.http.get<Partidos[]>(this.apiUrl).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
  obtenerCoaliciones(): Observable<Coaliciones[]> {
    return this.http.get<Coaliciones[]>(this.apiUrlCoa).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
