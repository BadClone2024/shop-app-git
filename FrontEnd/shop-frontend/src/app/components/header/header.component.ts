import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { CartService } from '../../services/cart.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  cartItemsCount: number = 0;
  currentUrl: string = '';
  @Input() role: any;
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private cartService: CartService,
    public router: Router
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
}