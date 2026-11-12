import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutShopComponent } from './checkout-shop.component';

describe('CheckoutShopComponent', () => {
  let component: CheckoutShopComponent;
  let fixture: ComponentFixture<CheckoutShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutShopComponent ]
    })
    .compileComponents();
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
