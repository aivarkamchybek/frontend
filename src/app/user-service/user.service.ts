import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, User } from '../Interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:44353/api/users';
  private apiUrl2 = 'https://localhost:44353/';
  

  constructor(private http: HttpClient) { }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  login(loginData: LoginRequest): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', loginData.EmailOrUsername);
    body.set('password', loginData.Password); 
    body.set('grant_type', 'password');

    return this.http.post<any>(`${this.apiUrl2}/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  isUsernameExist(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/username-exists/${username}`);
  }

  isEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/email-exists?email=${encodeURIComponent(email)}`);
  }
}
