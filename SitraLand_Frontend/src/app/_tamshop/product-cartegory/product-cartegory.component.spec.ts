import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCartegoryComponent } from './product-cartegory.component';
import { ProductCartegoryModule } from './product-cartegory.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('ProductCartegoryComponent', () => {
  let component: ProductCartegoryComponent;
  let fixture: ComponentFixture<ProductCartegoryComponent>;

  beforeEach(async () => {
    configureTestBed(ProductCartegoryComponent, ProductCartegoryModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCartegoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});