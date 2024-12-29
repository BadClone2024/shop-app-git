import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.scss'],
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true  // Add this line
})
export class CreateproductComponent {
  currentUrl: string = '';
  product: any = {
    name: '',
    price: 0,
    inStock: 0,
    imgUrl: ''
  };

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.currentUrl = this.router.url;
    console.log('Initial URL:', this.currentUrl);
  }

  createProduct() {
    this.productService.create(this.product).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Failed to create product:', error);
      }
    });
  }
}