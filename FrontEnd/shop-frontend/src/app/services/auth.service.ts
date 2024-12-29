import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5153/api';  // Your backend URL
  response: object = {};

  constructor(
    private http: HttpClient
  ) {

  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/login`, { email, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User`, user);
  }

}