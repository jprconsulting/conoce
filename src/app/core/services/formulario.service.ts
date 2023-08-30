import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Formulario } from 'src/app/models/formulario';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {
  route = `${environment.apiUrl}/agregar_formulario`;
  private _refreshLisUsers$ = new Subject<Formulario>();


  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  postFormulario(formData: FormData): Observable<Formulario> {
    return this.http.post<Formulario>(this.route, formData)
      .pipe(
        tap(() => {
          const dummyFormulario: Formulario = {
            FormularioIdFront: '',
            FormNameFront: '',
            GoogleFormIdFront: '',
            GoogleEditFormIdFront: '',
            SpreadsheetIdFront: '',
            SheetNameFront: '',
            ProjectIdFront: '',
            archvioJson: null
          };
          this._refreshLisUsers$.next(dummyFormulario);
        }),
        catchError(this.handleErrorService.handleError)
      );
  }

}
