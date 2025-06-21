import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {
  private readonly apiUrl = environment.apiUrl + '/users/validate';

  constructor(private http: HttpClient) { }

  activate(email: string, code: string): Observable<string> {
    return this.http.post(`${this.apiUrl}?email=${email}&code=${code}`, {}, {
      responseType: 'text'
    });
  }

}
