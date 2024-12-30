import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connectedusers',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './connectedusers.component.html',
  styleUrl: './connectedusers.component.scss'
})
export class ConnectedUsersComponent implements OnInit, OnDestroy {
  allUsers: any[] = [];
  connectedUsersIds: string[] = [];
  connectedUsers: any[] = [];
  offlineUsers: any[] = [];
  filteredConnectedUsers: any[] = [];
  filteredOfflineUsers: any[] = [];
  currentUser: any;
  private subscriptions = new Subscription();

  constructor(
    private signalRService: SignalRService,
    private userService: UserService,
    private searchService: SearchService,
    private authService: AuthService,
  ) {
    this.currentUser = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.loadUsers();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadUsers() {
    this.subscriptions.add(
      this.authService.getAllUsers().subscribe({
        next: (users) => {
          this.allUsers = users;
          this.updateUserLists();
        }
      })
    );
  }

  private setupSubscriptions() {
    this.subscriptions.add(
      this.signalRService.onlineUsers$.subscribe(userIds => {
        this.connectedUsersIds = userIds;
        this.updateUserLists();
      })
    );

    this.subscriptions.add(
      this.searchService.searchTerm$.subscribe(term => {
        this.filteredConnectedUsers = this.searchService.filterUsers(term, this.connectedUsers);
        this.filteredOfflineUsers = this.searchService.filterUsers(term, this.offlineUsers);
      })
    );
  }

  private updateUserLists() {
    if (!this.allUsers.length) return;

    this.connectedUsers = this.allUsers.filter(user => 
      this.connectedUsersIds.includes(user.id.toString())
    );
    this.offlineUsers = this.allUsers.filter(user => 
      !this.connectedUsersIds.includes(user.id.toString())
    );
    this.filteredConnectedUsers = this.connectedUsers;
    this.filteredOfflineUsers = this.offlineUsers;
  }
}