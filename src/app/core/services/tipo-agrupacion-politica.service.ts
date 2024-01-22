import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable } from 'rxjs';
import { TipoAgrupacionPolitica } from 'src/app/models/agrupacion-politica';

@Injectable({
  providedIn: 'root'
})
export class TipoAgrupacionPoliticaService {

  route = `${environment.apiUrl}/tipos-organizaciones-politicas`;

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  getTiposAgrupacionesPoliticas(): Observable<TipoAgrupacionPolitica[]> {
    return this.http.get<TipoAgrupacionPolitica[]>(`${this.route}/obtener-todos`);
  }
}
