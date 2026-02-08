import { Component, ViewEncapsulation } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero';
import { CategoriesComponent } from '../../components/categories/categories';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products';
import { StoryComponent } from '../../components/story/story';
import { ValuesComponent } from '../../components/values/values';
import { NewsletterComponent } from '../../components/newsletter/newsletter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CategoriesComponent,
    FeaturedProductsComponent,
    StoryComponent,
    ValuesComponent,
    NewsletterComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-categories></app-categories>
    <app-featured-products></app-featured-products>
    <app-story></app-story>
    <app-values></app-values>
    <app-newsletter></app-newsletter>
  `,
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {}
