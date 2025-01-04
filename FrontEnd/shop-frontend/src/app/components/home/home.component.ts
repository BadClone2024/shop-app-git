import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProductCardComponent } from "../product-card/product-card.component";
import { SearchService } from '../../services/search.service';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hasToken: boolean = false;
  userInfo: any;
  products: any[] = [];
  filter: any[] = [];

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.hasToken = !!localStorage.getItem('token');
    this.cartService.cartItems$.subscribe(items => {
      localStorage.setItem("Cart", JSON.stringify(items));
    });

    console.log("Has token = ", this.hasToken);

    this.userInfo = this.userService.getUserInfo();
    console.log("userService", this.userInfo.role);

    this.searchService.searchTerm$.subscribe((term: string) => {
      this.filter = this.searchService.filterProducts(term, this.products);
    });

    this.productService.get().subscribe({
      next: (data) => {
        this.products = data;
        this.filter = data;
        console.log(this.products);
      },
      error: (err) => {
        console.log("Failed to fetch products", err);
      }
    });

  }

}