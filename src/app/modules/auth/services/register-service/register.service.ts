import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';

export type RoleName = 'ROLE_USER' | 'ROLE_ADMIN';

export interface CreateUser {
    email: string;
    password: string;
    role: RoleName;
}

export interface ResponseCreateUser {
    message: string;
    id: number;
    email: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private readonly apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) {
    }

    register(userData: CreateUser): Observable<ResponseCreateUser> {
        return this.http.post<ResponseCreateUser>(`${this.apiUrl}`, userData);
    }
}

