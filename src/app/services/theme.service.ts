import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode.set(isDark);
      this.applyTheme(isDark);
    }
  }
  

  private applyTheme(isDark: boolean): void {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    this.applyTheme(newValue);
  }
}
