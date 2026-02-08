import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
  categoryId?: number;
}


export interface Category {
  id: number;
  name: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  
  // Images par défaut pour fallback
  private defaultImages = [
    '/images/WhatsApp Image 2026-02-03 at 18.49.32 (1).jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.32 (2).jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.33.jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.33 (1).jpeg'
  ];

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les produits (pour la page d'accueil)
   */
  getProducts(): Observable<Product[]> {
    return this.getAllProducts().pipe(
      map(products => products.slice(0, 4)), // Prendre les 4 premiers
      catchError(() => this.getFallbackProducts())
    );
  }

  /**
   * Récupère tous les produits
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produits`).pipe(
      catchError(error => {
        console.warn('Erreur lors du chargement de l\'API, utilisation des données par défaut', error);
        return of(this.getFallbackProductsSync());
      })
    );
  }

  /**
   * Récupère un produit par ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/produits/${id}`);
  }

  /**
   * Récupère les produits par catégorie
   */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produits/categorie/${categoryId}`).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Crée un nouveau produit
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/produits`, product);
  }

  /**
   * Met à jour un produit
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/produits/${id}`, product);
  }

  /**
   * Supprime un produit
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produits/${id}`);
  }

  /**
   * Produits par défaut (fallback si l'API n'est pas disponible)
   */
  private getFallbackProducts(): Observable<Product[]> {
    return of(this.getFallbackProductsSync());
  }

  private getFallbackProductsSync(): Product[] {
    return [
      { 
        id: 1, 
        name: 'Chaîne Or Délicate', 
        price: 89, 
        image: this.defaultImages[0],
        description: 'Une chaîne élégante en or 18 carats'
      },
      { 
        id: 2, 
        name: 'Collier Minimaliste', 
        price: 129, 
        image: this.defaultImages[1],
        description: 'Collier épuré et intemporel'
      },
      { 
        id: 3, 
        name: 'Bracelet Éternel', 
        price: 99, 
        image: this.defaultImages[2],
        description: 'Bracelet de luxe pour tous les jours'
      },
      { 
        id: 4, 
        name: 'Bague Signature', 
        price: 149, 
        image: this.defaultImages[3],
        description: 'Bague iconique de notre collection'
      },
    ];
  }
}

