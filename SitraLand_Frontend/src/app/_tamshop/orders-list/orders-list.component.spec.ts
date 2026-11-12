import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersListComponent } from './orders-list.component';
import { OrdersListModule } from './orders-list.module';
import { configureTestBed } from 'src/testing/test-helpers';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  beforeEach(async () => {
    configureTestBed(OrdersListComponent, OrdersListModule);
    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});