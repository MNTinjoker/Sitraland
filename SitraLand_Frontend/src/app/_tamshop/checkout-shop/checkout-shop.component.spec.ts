import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutShopComponent } from './checkout-shop.component';
import { CheckoutShopModule } from './checkout-shop.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('CheckoutShopComponent', () => {
  let component: CheckoutShopComponent;
  let fixture: ComponentFixture<CheckoutShopComponent>;

  beforeEach(async () => {
    configureTestBed(CheckoutShopComponent, CheckoutShopModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});