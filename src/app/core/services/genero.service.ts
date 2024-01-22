import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genero } from 'src/app/models/genero';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  route = `${environment.apiUrl}/generos`;

  constructor(
    private http: HttpClient
  ) { }


  getGeneros() {
    return this.http.get<Genero[]>(`${this.route}/obtener-todos`);
  }
}
