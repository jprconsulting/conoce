import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Estados } from 'src/app/models/estados';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = 'https://mocki.io/v1/2812ea7c-a71c-44c6-8e02-aa174658fd0c';

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) {}

  obtenerPartidos(): Observable<Estados[]> {
    return this.http.get<Estados[]>(this.apiUrl).pipe(
      catchError(this.handleErrorService.handleError)
    );
  }

}
