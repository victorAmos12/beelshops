import { Component, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './newsletter.html',
  encapsulation: ViewEncapsulation.None
})
export class NewsletterComponent {
  email: string = '';
  submitted: boolean = false;

  onSubmit(): void {
    if (this.email) {
      // À connecter à l'API réelle pour l'inscription
      console.log('Newsletter subscription:', this.email);
      this.submitted = true;
      this.email = '';

      setTimeout(() => {
        this.submitted = false;
      }, 5000);
    }
  }
}
 