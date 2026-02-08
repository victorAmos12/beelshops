import { Component } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';

interface Value {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-values',
  standalone: true,
  imports: [NgFor, NgSwitch, NgSwitchCase],
  templateUrl: './values.html'
})
export class ValuesComponent {
  values: Value[] = [
    {
      icon: 'truck',
      title: 'Livraison Rapide',
      description: 'Livraison gratuite en France pour toute commande supérieure à 50€'
    },
    {
      icon: 'star',
      title: 'Qualité Premium',
      description: 'Matériaux sélectionnés avec soin et savoir-faire artisanal'
    },
    {
      icon: 'shield',
      title: 'Paiement Sécurisé',
      description: 'Transactions 100% cryptées et sécurisées'
    },
    {
      icon: 'headphones',
      title: 'Service 24/7',
      description: 'Support client réactif pour vous aider à tout moment'
    }
  ];
}
     