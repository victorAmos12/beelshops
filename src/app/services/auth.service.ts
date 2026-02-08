import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  phone?: string;
  roles: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  data?: User;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  // Signals
  private userSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal(false);
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed signals
  isAuthenticated = computed(() => this.isAuthenticatedSignal());
  user = computed(() => this.userSignal());
  isLoading = computed(() => this.isLoadingSignal());
  error = computed(() => this.errorSignal());
  
  // Computed pour les rôles
  isAdmin = computed(() => this.userSignal()?.roles.includes('ROLE_ADMIN') ?? false);
  isClient = computed(() => this.userSignal()?.roles.includes('ROLE_CLIENT') ?? false);

  // Subject pour les changements d'authentification
  private authStateChanged = new BehaviorSubject<boolean>(false);
  authStateChanged$ = this.authStateChanged.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  /**
   * Initialise l'authentification en chargeant le token et l'utilisateur du localStorage
   */
  private initializeAuth(): void {
    const token = this.getToken();
    const storedUser = this.getStoredUser();

    if (token && storedUser) {
      this.userSignal.set(storedUser);
      this.isAuthenticatedSignal.set(true);
      this.authStateChanged.next(true);
      
      // Valider le token avec le serveur
      this.validateTokenWithServer(token).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.userSignal.set(response.data);
            this.saveUser(response.data);
          }
        },
        error: () => {
          // Token invalide, déconnecter
          this.logout();
        }
      });
    }
  }

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.saveToken(response.token);
          this.userSignal.set(response.user);
          this.saveUser(response.user);
          this.isAuthenticatedSignal.set(true);
          this.authStateChanged.next(true);
        }
      }),
      catchError((error) => this.handleError(error)),
      map((response) => {
        this.isLoadingSignal.set(false);
        return response;
      })
    );
  }

  /**
   * Inscription utilisateur
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          // Après l'inscription, on peut optionnellement connecter l'utilisateur
          // ou laisser l'utilisateur se connecter manuellement
        }
      }),
      catchError((error) => this.handleError(error)),
      map((response) => {
        this.isLoadingSignal.set(false);
        return response;
      })
    );
  }

  /**
   * Déconnexion utilisateur
   */
  logout(): void {
    this.removeToken();
    this.removeStoredUser();
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.errorSignal.set(null);
    this.authStateChanged.next(false);
  }

  /**
   * Récupère les informations de l'utilisateur connecté
   */
  getMe(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.API_URL}/me`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.userSignal.set(response.data);
          this.saveUser(response.data);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Rafraîchit le token JWT
   */
  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          this.saveToken(response.token);
          this.userSignal.set(response.user);
          this.saveUser(response.user);
        }
      }),
      catchError((error) => {
        this.logout();
        return this.handleError(error);
      })
    );
  }

  /**
   * Récupère le token JWT du localStorage
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Sauvegarde le token JWT dans le localStorage
   */
  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Supprime le token JWT du localStorage
   */
  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Sauvegarde l'utilisateur dans le localStorage
   */
  private saveUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Récupère l'utilisateur du localStorage
   */
  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  /**
   * Supprime l'utilisateur du localStorage
   */
  private removeStoredUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Valide le token avec le serveur
   */
  private validateTokenWithServer(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}).pipe(
      catchError(() => throwError(() => new Error('Token validation failed')))
    );
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = error.error.message;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.error || error.statusText || errorMessage;
    }

    this.errorSignal.set(errorMessage);
    console.error('[AuthService] Erreur:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    return this.userSignal()?.roles.includes(role) ?? false;
  }

  /**
   * Vérifie si l'utilisateur a au moins un des rôles spécifiés
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.userSignal()?.roles ?? [];
    return roles.some(role => userRoles.includes(role));
  }

  /**
   * Vérifie si l'utilisateur a tous les rôles spécifiés
   */
  hasAllRoles(roles: string[]): boolean {
    const userRoles = this.userSignal()?.roles ?? [];
    return roles.every(role => userRoles.includes(role));
  }
}
