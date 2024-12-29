import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: any;
  @Input() role: any;
  isEditing: boolean = false;


  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) { }

  addToCart(product: any) {
    this.cartService.addToCart(product)
    console.log(`Added to cart ${product.name}`);
  }
  
  toggleEdit() {
    console.log(this.role);
    this.isEditing = !this.isEditing;
  }
  saveChanges() {
    console.log(this.product);
    this.isEditing = false;
  }
  createProduct() {
    this.productService.create(this.product)
  }
  updateProduct() {
    console.log(this.product);
    this.productService.update(this.product).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated:', updatedProduct);
        this.isEditing = false;
      },
      error: (error) => {
        console.error('Failed to update product:', error);
      }
    });
  }
  deleteProduct() {
    this.productService.delete(this.product.id).subscribe({
      next: (deleteProduct) => {
        console.log("product was deleted: \n", this.product, "\n", deleteProduct);
        window.location.reload();
      },
      error: (error) => {
        console.log("Error accured: \n", error);
      }
    });
  }
  
  
}
