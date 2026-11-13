import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Shows a local placeholder instead of the broken image icon when a product
 * image can not be loaded (a product without a photo, or a photo that is
 * missing on the server).
 */
@Directive({
  standalone: false,
  selector: 'img[appImageFallback]'
})
export class ImageFallbackDirective {
  private static readonly placeholder = 'assets/images/product-placeholder.svg';

  private applied = false;

  constructor(private readonly element: ElementRef<HTMLImageElement>) { }

  @HostListener('error')
  onError(): void {
    // The placeholder must not replace itself in a loop when it can not load.
    if (this.applied) {
      return;
    }

    this.applied = true;

    const image = this.element.nativeElement;
    image.src = ImageFallbackDirective.placeholder;
    image.classList.add('image-fallback');
  }
}
