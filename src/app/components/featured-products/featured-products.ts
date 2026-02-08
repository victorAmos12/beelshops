import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './featured-products.html',
  styleUrl: './featured-products.css'
})
export class FeaturedProductsComponent implements OnInit {
  private productService = inject(ProductService);
  
  products$: Observable<Product[]> = new Observable();
  isLoading = signal(false);
  error = signal<string>('');
  defaultImage = '/images/WhatsApp Image 2026-02-03 at 18.49.30.jpeg';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set('');
    
    this.products$ = this.productService.getProducts();
    
    // S'abonner pour gérer les erreurs
    this.products$.subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        console.error('Erreur lors du chargement des produits:', err);
        this.error.set('Impossible de charger les produits. Veuillez réessayer.');
        this.isLoading.set(false);
      }
    });
  }
}
