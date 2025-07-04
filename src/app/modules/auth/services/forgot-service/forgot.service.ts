import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {
  private readonly apiUrl = environment.apiUrl + '/users';


  constructor(private http: HttpClient) {
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/forgotPassword', {email});
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/resetPassword', {email, code, newPassword});
  }
}
