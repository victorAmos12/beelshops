import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-pwa-install-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pwa-install-modal.html',
  styleUrl: './pwa-install-modal.css'
})
export class PwaInstallModalComponent implements OnInit {
  private pwaInstallService = inject(PwaInstallService);
  isInstallable = this.pwaInstallService.isInstallable;
  isInstalled = this.pwaInstallService.isInstalled;
  isIOS = this.pwaInstallService.isIOS;

  ngOnInit(): void {
    // Le service gère automatiquement la détection
  }

  async installApp(): Promise<void> {
    const success = await this.pwaInstallService.installApp();
    if (success) {
      console.log('Application installée avec succès');
    }
  }

  dismissModal(): void {
    this.pwaInstallService.dismissInstallPrompt();
  }
}
