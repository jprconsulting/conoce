import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { DistritoLocal } from 'src/app/models/distritoLocal';

@Injectable({
  providedIn: 'root'
})
export class DistritoLocalService {
  private apiUrl = 'https://localhost:7154/api/distritolocal';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  getDistritosLocales(): Observable<DistritoLocal[]> {
    return this.http.get<DistritoLocal[]>(`${this.apiUrl}/obtener_distritos`).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

  postDistritoLocal(distritoLocal: DistritoLocal): Observable<DistritoLocal> {
    return this.http.post<DistritoLocal>(`${this.apiUrl}/agregar_distrito`, distritoLocal).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }
}
