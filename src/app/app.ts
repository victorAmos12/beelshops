import { Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterOutlet, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { CategoriesComponent } from './components/categories/categories';
import { FeaturedProductsComponent } from './components/featured-products/featured-products';
import { StoryComponent } from './components/story/story';
import { ValuesComponent } from './components/values/values';
import { NewsletterComponent } from './components/newsletter/newsletter';
import { FooterComponent } from './components/footer/footer';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    CategoriesComponent,
    FeaturedProductsComponent,
    StoryComponent,
    ValuesComponent,
    NewsletterComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [ThemeService],
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
