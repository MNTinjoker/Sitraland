import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail.component';
import { OrderDetailModule } from './order-detail.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async () => {
    configureTestBed(OrderDetailComponent, OrderDetailModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});