import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCartegoryComponent } from './product-cartegory.component';

describe('ProductCartegoryComponent', () => {
  let component: ProductCartegoryComponent;
  let fixture: ComponentFixture<ProductCartegoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCartegoryComponent ]
    })
    .compileComponents();
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
