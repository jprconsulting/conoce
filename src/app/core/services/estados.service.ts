import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/models/estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  route = `${environment.apiUrl}/estados`;

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(`${this.route}/obtener-todos`);
  }
}
