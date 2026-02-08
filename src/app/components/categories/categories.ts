import { Component, OnInit, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProductService } from '../../services/product.service';

export interface Category {
  id: number;
  name: string;
  image?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgFor],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  defaultImage = '/images/WhatsApp Image 2026-02-03 at 18.49.31.jpeg';
  
  categories: Category[] = [
    { id: 1, name: 'Chaînes', image: '/images/WhatsApp Image 2026-02-03 at 18.49.31.jpeg' },
    { id: 2, name: 'Colliers', image: '/images/WhatsApp Image 2026-02-03 at 18.49.31 (1).jpeg' },
    { id: 3, name: 'Bracelets', image: '/images/WhatsApp Image 2026-02-03 at 18.49.31 (2).jpeg' },
    { id: 4, name: 'Bagues', image: '/images/WhatsApp Image 2026-02-03 at 18.49.32.jpeg' }
  ];

  ngOnInit(): void {
    // Les catégories sont pour demo - à adapter selon l'API réelle si disponible
  }
}

