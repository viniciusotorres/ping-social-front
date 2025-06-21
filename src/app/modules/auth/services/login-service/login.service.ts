import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environments';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = environment.apiUrl + '/users/login';


  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {email, password});
  }
}
