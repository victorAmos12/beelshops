import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard fonctionnel pour protéger les routes
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Vérifier les rôles requis si spécifiés
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && requiredRoles.length > 0) {
      if (authService.hasAnyRole(requiredRoles)) {
        return true;
      } else {
        // Rôle insuffisant
        router.navigate(['/unauthorized']);
        return false;
      }
    }
    return true;
  }

  // Pas authentifié, rediriger vers login
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
