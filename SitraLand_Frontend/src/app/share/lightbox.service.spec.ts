import { TestBed } from '@angular/core/testing';
import { LightboxService } from './lightbox.service';

describe('LightboxService', () => {
  let service: LightboxService;

  const album = [
    { src: '/images/one.jpg' },
    { src: '/images/two.jpg' },
    { src: '/images/three.jpg' }
  ];

  beforeEach(() => {
    service = TestBed.inject(LightboxService);
  });

  it('opens the album at the requested index', () => {
    service.open(album, 1);

    expect(service.visible()).toBe(true);
    expect(service.album().length).toBe(3);
    expect(service.currentIndex()).toBe(1);
    expect(service.current?.src).toBe('/images/two.jpg');
  });

  it('ignores an empty album', () => {
    service.open([], 0);

    expect(service.visible()).toBe(false);
  });

  it('moves to the next and the previous image', () => {
    service.open(album, 0);

    service.next();
    expect(service.currentIndex()).toBe(1);

    service.next();
    service.next();
    expect(service.currentIndex()).toBe(0);

    service.previous();
    expect(service.currentIndex()).toBe(2);
  });

  it('closes the gallery', () => {
    service.open(album, 0);
    service.close();

    expect(service.visible()).toBe(false);
  });
});
