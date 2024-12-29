import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  filtered: any[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      localStorage.setItem("Cart", JSON.stringify(items));
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filtered = this.searchService.filterArray(term, this.cartItems);
    });
  }

  updateQuantity(itemId: number, quantity: number) {    
    if (quantity < 1) {       
      return;
    }

    this.cartService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId);
  }
  
}