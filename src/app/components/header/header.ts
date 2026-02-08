import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { PwaInstallService } from '../../services/pwa-install.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private pwaInstallService = inject(PwaInstallService);
  private authService = inject(AuthService);
  
  darkMode = this.themeService.darkMode;
  showInstallButton = this.pwaInstallService.showInstallButton;
  isAuthenticated = this.authService.isAuthenticated;
  user = this.authService.user;
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(val => !val);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  async installApp(): Promise<void> {
    await this.pwaInstallService.installApp();
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(val => !val);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
  }
}
