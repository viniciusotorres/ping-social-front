import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = environment.apiUrl + '/users';


  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/login', {email, password});
  }

  getMyInfo(): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/myInfo/${localStorage.getItem('userId')}`);
  }

  saveLocation(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/saveLocation/${localStorage.getItem('userId')}`, data);
  }
}
