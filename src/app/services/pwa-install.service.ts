import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;
  isInstallable = signal(false);
  isInstalled = signal(false);
  showInstallButton = signal(false);
  isIOS = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkIfInstalled();
      this.checkIfIOS();
      this.setupInstallPrompt();
    }
  }

  private checkIfInstalled(): void {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.set(true);
      console.log('[PWA] App déjà installée (standalone mode)');
    }

    // Écouter les changements de mode d'affichage
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isInstalled.set(e.matches);
      console.log('[PWA] Mode standalone changé:', e.matches);
    });
  }

  private checkIfIOS(): void {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                  !(window as any).MSStream;
    this.isIOS.set(isIOS);
    console.log('[PWA] Détection iOS:', isIOS);
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.isInstallable.set(true);
      console.log('[PWA] beforeinstallprompt déclenché - App installable');
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.isInstallable.set(false);
      this.deferredPrompt = null;
      console.log('[PWA] App installée avec succès');
    });

    // Fallback pour les navigateurs qui ne supportent pas beforeinstallprompt
    if (!('onbeforeinstallprompt' in window)) {
      console.log('[PWA] beforeinstallprompt non supporté - Vérification manuelle');
      // Afficher le modal après un délai si l'app n'est pas installée
      if (!this.isInstalled() && !this.isIOS()) {
        setTimeout(() => {
          if (!this.isInstalled()) {
            this.isInstallable.set(true);
            console.log('[PWA] Affichage du modal d\'installation (fallback)');
          }
        }, 2000);
      }
    }
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
