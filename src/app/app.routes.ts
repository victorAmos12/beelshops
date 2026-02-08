import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './layouts/layout';
import { AuthLayoutComponent } from './layouts/auth-layout';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  // Routes d'authentification (sans header/footer)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },

  // Routes principales (avec header/footer)
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        data: { roles: ['ROLE_CLIENT', 'ROLE_ADMIN'] },
        children: [
          // À ajouter: composants du dashboard
        ]
      },
      {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['ROLE_ADMIN'] },
        children: [
          // À ajouter: composants admin
        ]
      }
    ]
  },

  // Redirection par défaut
  {
    path: '**',
    redirectTo: '/'
  }
];
