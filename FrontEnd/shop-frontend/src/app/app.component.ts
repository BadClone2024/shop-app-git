import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { SearchService } from './services/search.service';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalRService } from './services/signalr.service';
import { TokenService } from './services/token.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  userInfo: any;
  currenturl: string = "";
  connected: boolean = false;

  constructor(
    private searchService: SearchService,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private signalRservice: SignalRService,
    private tokenService: TokenService,
    public router: Router,


  ) { }

  ngOnInit(): void {
    this.updateUser();
    this.startConnection();
    console.log("ngoninit app component");
  }
  ngOnDestroy(): void {
    this.signalRservice.disconnect();
  }
  updateUser() {
    this.userService.userTerm$.subscribe((user: any) => {
      this.userInfo = user;
      console.log("this.userInfo:", this.userInfo);
    })
  }
  startConnection() {
    this.signalRservice.connectionState$.subscribe((state => this.connected = state))
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url !== '/login' && event.url !== '/register' && !this.connected) {
        console.log("Start connection ngoninit");
        this.signalRservice.startConnection();
        this.connected = true;
      }
    });
  }
  title = 'shop-frontend';
}
