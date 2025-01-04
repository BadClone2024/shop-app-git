import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';
import { SearchService } from '../../services/search.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  filtered: any[] = [];
  total: number = 0;
  bought: boolean = false;
  userInfo: any;

  constructor(
    private cartService: CartService,
    private searchService: SearchService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.bought = false;
    this.cartService.cartItems$.subscribe(items => {
      localStorage.setItem("Cart", JSON.stringify(items));
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filtered = this.searchService.filterProducts(term, this.cartItems);
    });
    this.userInfo = this.userService.getUserInfo();
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
  buy() {
    this.cartService.bought();
    this.bought = true;
  }
  // ngOnDestroy(): void {
  //   this.bought = false;
  // }
  
}