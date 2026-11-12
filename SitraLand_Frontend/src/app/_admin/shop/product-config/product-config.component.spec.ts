import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductConfigComponent } from './product-config.component';
import { ProductConfigModule } from './product-config.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('ProductConfigComponent', () => {
  let component: ProductConfigComponent;
  let fixture: ComponentFixture<ProductConfigComponent>;

  beforeEach(async () => {
    configureTestBed(ProductConfigComponent, ProductConfigModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});