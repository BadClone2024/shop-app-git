import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SignalRService } from './signalr.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo: any;
  private apiUrl = 'http://localhost:5153/api';
  response: object = {};

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService,
    private tokenService: TokenService,
    private userService: UserService
  ) {

  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/User/login`, { email, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/User`, user);
  }

  logOut(): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${this.tokenService.getToken()}`
    };
    const cart = localStorage.getItem('Cart');

    return this.http.post(`${this.apiUrl}/User/logout`, {}, { headers }).pipe(
      tap((response: any) => {
        if (response.succesfull) {
          console.log("Response: ", response.message);
          this.signalRService.disconnect();
          console.log("Clearing localstoraged");
          localStorage.clear();
          if (cart) {
            localStorage.setItem('Cart', cart);
            console.log("cart:", cart);
          }
        } else {
          console.log("Response: ", response.message);
        }
      })
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/User`);
  }
  delete(): Observable<any> {
    this.userInfo = this.userService.getUserInfo();
    return this.http.delete(`${this.apiUrl}/User/${this.userInfo.id}`).pipe(
      tap(() => {
        localStorage.clear();
      })
    );
  }

}