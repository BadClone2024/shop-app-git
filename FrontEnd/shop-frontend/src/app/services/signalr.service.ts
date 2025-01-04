// src/app/services/signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private onlineUsers = new BehaviorSubject<string[]>([]);
  private connectionStateSubject = new BehaviorSubject<boolean>(false);
  onlineUsers$ = this.onlineUsers.asObservable();
  connectionState$ = this.connectionStateSubject.asObservable();

  constructor(private tokenService: TokenService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5153/userHub', {
        accessTokenFactory: () => {
          const token = this.tokenService.getToken();
          if (!token) {
            console.log('No token found');
            return '';
          }
          const bearerToken = `Bearer ${token}`;  // Make sure we format it correctly
          console.log('Sending token:', bearerToken);
          return bearerToken;
        }
      })
      .withAutomaticReconnect()
      .build();
      this.setupSignalRListeners();
  }

  private setupSignalRListeners() {
    this.hubConnection.on('UserConnected', (userId: string) => {
      console.log('User connected:', userId);
      this.refreshOnlineUsers();
    });

    this.hubConnection.on('UserDisconnected', (userId: string) => {
      console.log('User disconnected:', userId);
      this.refreshOnlineUsers();
    });
  }

  async startConnection() {
    try {
      await this.hubConnection.start();
      console.log('SignalR Connected!');
      this.connectionStateSubject.next(true);
      this.refreshOnlineUsers();
    } catch (err) {
      console.error('Error while connecting:', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  private async refreshOnlineUsers() {
    try {
      const users = await this.hubConnection.invoke('GetOnlineUsers');
      console.log('Received online users:', users);
      this.onlineUsers.next(users);
    } catch (err) {
      console.error('Error getting online users:', err);
    }
  }

  async disconnect() {
    try {
      await this.hubConnection.stop();
      console.log('SignalR Disconnected');
      this.connectionStateSubject.next(false);
    } catch (err) {
      console.error('Error while disconnecting:', err);
    }
  }
}