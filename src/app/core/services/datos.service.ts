import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consentimiento } from 'src/app/models/consentimientos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private baseUrl = `${environment.apiUrl}/consentimiento`; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  getDatosById(id: number): Observable<Consentimiento> {
    return this.http.get<Consentimiento>(`${this.baseUrl}/datos/${id}`);
  }
}