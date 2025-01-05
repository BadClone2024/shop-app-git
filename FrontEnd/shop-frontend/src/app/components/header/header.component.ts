import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { CartService } from '../../services/cart.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { SignalRService } from '../../services/signalr.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  cartItemsCount: number = 0;
  currentUrl: string = '';
  placeHolder: string = "";
  request: string = "";
  title: string = "";
  message: string = "";
  showConfirmationDialogue: boolean = false;
  @Input() role: any;
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private cartService: CartService,
    public router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private signalRservice: SignalRService,
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log('Initial URL:', this.currentUrl);

    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.currentUrl = this.router.url;
        this.setPlaceHolder();
        console.log("place holder:", this.placeHolder);
        console.log('Current URL:', this.currentUrl);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.searchService.updateSearchTerm(this.searchTerm.trim());
  }
  onConfirmLogOut() {
    this.authService.logOut().subscribe({
      next: () => {
        console.log("User logged out");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log("Error accured", err);
      }
    })
  }
  onConfirmDelete() {
    this.authService.delete().subscribe({
      next: () => {
        console.log("User was deleted successfuly");
        this.router.navigate(['/register']);
      },
      error: (err) => {
        console.log("Error accured", err);
      }
    })
  }
  openDeleteDialogue() {
    this.showConfirmationDialogue = true;
    this.title = "Delete account";
    this.message = "Are you sure you want to delete your user?"
    this.request = "delete";
  }
  openLogoutDialogue() {
    this.showConfirmationDialogue = true;
    this.title = "Log-out";
    this.message = "Are you sure you want to log-out?"
    this.request = "logout";
  }

  onCancelDialogue() {
    this.showConfirmationDialogue = false;
  }

  dialogue() {
    if (this.request === "delete") {
      this.onConfirmDelete();
    } else {
      this.onConfirmLogOut();
    }

    this.showConfirmationDialogue = false;
  }

  setPlaceHolder() {
    if (this.currentUrl == '/home') {
      this.placeHolder = 'Search product';
    }
    if (this.currentUrl == '/connectedusers')
      this.placeHolder = 'Search users';
  }

}