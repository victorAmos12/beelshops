import { Component, OnInit, OnDestroy, signal, effect, ViewEncapsulation } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgFor],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlideIndex = signal(0);
  autoAdvanceProgress = signal(0);
  
  sliderImages = [
    '/images/WhatsApp Image 2026-02-03 at 18.49.30.jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.31 (1).jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.32 (1).jpeg',
    '/images/WhatsApp Image 2026-02-03 at 18.49.33 (1).jpeg'
  ];

  private autoAdvanceInterval: any;
  private progressInterval: any;
  private readonly AUTO_ADVANCE_DELAY = 6000; // 6 secondes

  constructor() {
    effect(() => {
      // Mettre à jour le progress quand l'index change
      this.autoAdvanceProgress.set(0);
    });
  }

  ngOnInit(): void {
    this.startAutoAdvance();
  }

  ngOnDestroy(): void {
    this.stopAutoAdvance();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex.set(index);
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }

  private startAutoAdvance(): void {
    let progress = 0;

    // Progressbar animation
    this.progressInterval = setInterval(() => {
      progress += 1.67; // 100 / 60 pour 6 secondes
      this.autoAdvanceProgress.set(Math.min(progress / 100, 1));
    }, 100);

    // Slide advancement
    this.autoAdvanceInterval = setTimeout(() => {
      const nextIndex = (this.currentSlideIndex() + 1) % this.sliderImages.length;
      this.currentSlideIndex.set(nextIndex);
      this.startAutoAdvance();
    }, this.AUTO_ADVANCE_DELAY);
  }

  private stopAutoAdvance(): void {
    if (this.autoAdvanceInterval) {
      clearTimeout(this.autoAdvanceInterval);
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }
}

