import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaInstallModalComponent } from './components/pwa-install-modal/pwa-install-modal';
import { ThemeService } from './services/theme.service';
import { PwaInstallService } from './services/pwa-install.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PwaInstallModalComponent
  ],
  template: `
    <app-pwa-install-modal></app-pwa-install-modal>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.css',
  providers: [ThemeService, PwaInstallService],
  encapsulation: ViewEncapsulation.None
})
export class App {
  protected readonly title = signal('beel');
  
  constructor(private themeService: ThemeService) {
    // Initialize theme service - force the initialization
    if (typeof window !== 'undefined') {
      // Ensure theme is applied on app startup
      const isDark = this.themeService.darkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}
