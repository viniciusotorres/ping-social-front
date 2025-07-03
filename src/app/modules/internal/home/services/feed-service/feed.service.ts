import { Injectable } from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface PostRequest {
  userId: number;
  content: string;
  tribeIds: number[];
}

export interface ResponsePost {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  tribeNames?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private readonly apiUrl = environment.apiUrl + '/posts';

  constructor(private http: HttpClient) {
  }

  createPost(postData: PostRequest): Observable<ResponsePost> {
    return this.http.post<ResponsePost>(this.apiUrl, postData);
  }

  getPosts(userId: number, filterType: string): Observable<any> {
    const params = {
      filterType: filterType
    };
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { params });
  }
}
