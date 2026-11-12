import { Injectable, signal } from '@angular/core';

export interface LightboxImage {
  src: string;
  type?: string;
  caption?: string;
}

export interface LightboxOptions {
  showZoom?: boolean;
  showImageNumberLabel?: boolean;
  alwaysShowNavOnTouchDevices?: boolean;
  centerVertically?: boolean;
}

/**
 * Lightbox state shared between the components that open the gallery and the
 * overlay component that renders it.
 */
@Injectable({ providedIn: 'root' })
export class LightboxService {
  readonly album = signal<LightboxImage[]>([]);
  readonly currentIndex = signal(0);
  readonly visible = signal(false);
  readonly options = signal<LightboxOptions>({});

  open(album: LightboxImage[], index = 0, options: LightboxOptions = {}): void {
    if (!album || album.length === 0) {
      return;
    }

    this.album.set(album);
    this.currentIndex.set(Math.min(Math.max(index, 0), album.length - 1));
    this.options.set(options);
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }

  next(): void {
    if (this.album().length < 2) {
      return;
    }

    this.currentIndex.set((this.currentIndex() + 1) % this.album().length);
  }

  previous(): void {
    if (this.album().length < 2) {
      return;
    }

    this.currentIndex.set((this.currentIndex() - 1 + this.album().length) % this.album().length);
  }

  get current(): LightboxImage | undefined {
    return this.album()[this.currentIndex()];
  }
}
