import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    const localCart = localStorage.getItem("Cart")
    if (localCart) this.cartItems.next(JSON.parse(localCart))
  }

  addToCart(product: any) {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { ...product, quantity: 1 }]);
    }

  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter(item => item.id !== productId));
  }

  updateQuantity(itemId: number, quantity: number) {
    const currentItems = this.cartItems.getValue();
    const item = currentItems.find(i => i.id === itemId);

    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
    }
  }


  getTotal(): number {
    return this.cartItems.getValue().reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
  }
  bought() {
    // Clear the cart from local storage
    localStorage.removeItem('cart');
    
    // Update the cart observable to an empty array (or suitable default)
    this.cartItems.next([]);
  }
  
}