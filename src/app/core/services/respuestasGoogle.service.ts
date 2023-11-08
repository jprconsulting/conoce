import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HandleErrorService } from './handle-error.service';
import { Observable, Subject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ConfigGoogleForm } from 'src/app/models/googleForm';

@Injectable({
  providedIn: 'root'
})
export class RespuestasGoogleService {
  route = `${environment.apiUrl}/`;
  private _refreshLisUsers$ = new Subject<ConfigGoogleForm[]>();

  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  get refreshLisUsers() {
    return this._refreshLisUsers$;
  }

  enviarGoogleFormIds(googleFormIds: string[]): Observable<any> {
    const url = `${this.route}/`;
    const data = { googleFormIds };

    return this.http.post(url, data).pipe(
      tap(() => {
        this._refreshLisUsers$;
      }),
      catchError(this.handleErrorService.handleError)
    );
  }
}
