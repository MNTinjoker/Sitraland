import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCarouselComponent } from './product-carousel.component';
import { ProductCarouselModule } from './product-carousel.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('ProductCarouselComponent', () => {
  let component: ProductCarouselComponent;
  let fixture: ComponentFixture<ProductCarouselComponent>;

  beforeEach(async () => {
    configureTestBed(ProductCarouselComponent, ProductCarouselModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});