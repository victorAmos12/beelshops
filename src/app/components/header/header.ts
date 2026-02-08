import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  private themeService = inject(ThemeService);
  private pwaInstallService = inject(PwaInstallService);
  darkMode = this.themeService.darkMode;
  showInstallButton = this.pwaInstallService.showInstallButton;
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

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
}
