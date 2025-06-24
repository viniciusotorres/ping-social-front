import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly apiUrl = environment.apiUrl + '/tribes';

  constructor(private http: HttpClient) {
  }

  getTribes(): Observable<any>{
    return this.http.get<any>(this.apiUrl + '/all');
  }

  hasTribe(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/has-tribe');
  }

  joinTribe(tribeId: number): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/join', {tribeId});
  }

  loadTribeByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }




}
