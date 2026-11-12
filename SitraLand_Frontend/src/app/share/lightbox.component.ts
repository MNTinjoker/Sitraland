import { Component, OnDestroy, OnInit } from '@angular/core';
import { LightboxService } from './lightbox.service';

@Component({
  standalone: false,
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.css']
})
export class LightboxComponent implements OnInit, OnDestroy {
  zoomed = false;

  constructor(public lightbox: LightboxService) { }

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent): void => {
    if (!this.lightbox.visible()) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.lightbox.previous();
        break;
      case 'ArrowRight':
        this.lightbox.next();
        break;
    }
  };

  close(): void {
    this.zoomed = false;
    this.lightbox.close();
  }

  next(event: Event): void {
    event.stopPropagation();
    this.lightbox.next();
  }

  previous(event: Event): void {
    event.stopPropagation();
    this.lightbox.previous();
  }

  toggleZoom(): void {
    this.zoomed = !this.zoomed;
  }

  showImageNumber(): boolean {
    return this.lightbox.options().showImageNumberLabel !== false && this.lightbox.album().length > 1;
  }

  showZoom(): boolean {
    return this.lightbox.options().showZoom !== false;
  }
}
