import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;
  isInstallable = signal(false);
  isInstalled = signal(false);
  showInstallButton = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkIfInstalled();
      this.setupInstallPrompt();
    }
  }

  private checkIfInstalled(): void {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.set(true);
    }

    // Écouter les changements de mode d'affichage
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isInstalled.set(e.matches);
    });
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
      this.deferredPrompt = null;
    });
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.isInstalled.set(true);
        this.isInstallable.set(false);
        this.deferredPrompt = null;
        return true;
      } else {
        // L'utilisateur a cliqué sur "Plus tard"
        this.showInstallButton.set(true);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      return false;
    }
  }

  dismissInstallPrompt(): void {
    this.isInstallable.set(false);
    this.showInstallButton.set(true);
  }

  resetInstallButton(): void {
    this.showInstallButton.set(false);
  }
}
