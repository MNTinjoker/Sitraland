import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { notifierStub } from 'src/testing/test-helpers';
import { ProductListComponent } from './_admin/shop/product-list/product-list.component';
import { ProductListModule } from './_admin/shop/product-list/product-list.module';
import { ProductCartegoryComponent } from './_tamshop/product-cartegory/product-cartegory.component';
import { ProductCartegoryModule } from './_tamshop/product-cartegory/product-cartegory.module';
import { homeComponent } from './_tamshop/home/home.component';
import { homeModule } from './_tamshop/home/home.module';

describe('PrimeNG components', () => {
  const providers = [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    { provide: NotifierService, useValue: notifierStub }
  ];

  it('renders the admin table', async () => {
    await TestBed.configureTestingModule({ imports: [ProductListModule], providers }).compileComponents();

    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('p-table')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.p-datatable')).toBeTruthy();
  });

  it('renders the category data view', async () => {
    await TestBed.configureTestingModule({ imports: [ProductCartegoryModule], providers }).compileComponents();

    const fixture = TestBed.createComponent(ProductCartegoryComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('p-dataview')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.p-dataview')).toBeTruthy();
  });

  it('renders the home page', async () => {
    await TestBed.configureTestingModule({ imports: [homeModule], providers }).compileComponents();

    const fixture = TestBed.createComponent(homeComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
