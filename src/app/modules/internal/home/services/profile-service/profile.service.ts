import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = environment.apiUrl + '/follow';
  private readonly apiUrlUsers = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  followUser(followUserId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow`, { followUserId });
  }

  unfollowUser(followUserId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unfollow`, { followUserId });
  }

  getFollowedUsersByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/followers/${userId}`);
  }

  getFollowingUsersByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/following/${userId}`);
  }

  verifyFollowedUser(followUserId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/is-following/${followUserId}`);
  }

  getSuggestedUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlUsers}/suggestionsUsers`);
  }
}
