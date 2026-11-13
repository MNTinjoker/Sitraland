import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

// constructor(
//   private http: HttpClient
// ) { }

const routes: Routes = [
  {
    path: 'home', loadChildren: () => import('./_tamshop/home/home.module').then(m => m.homeModule),
  },
  {
    path: '', loadChildren: () => import('./_tamshop/home/home.module').then(m => m.homeModule),
  },
  {
    path: 'admin/product-config/:id', loadChildren: () => import('./_admin/shop/product-config/product-config.module').then(m => m.ProductConfigModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/product-config', loadChildren: () => import('./_admin/shop/product-config/product-config.module').then(m => m.ProductConfigModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/product-list', loadChildren: () => import('./_admin/shop/product-list/product-list.module').then(m => m.ProductListModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user-managment', loadChildren: () => import('./_admin/user-managment/user-managment.module').then(m => m.UserManagmentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-detail/:id', loadChildren: () => import('./_tamshop/product-detail/product-detail.module').then(m => m.ProductDetailModule),
  },
  {
    path: 'product-cartegory/:id', loadChildren: () => import('./_tamshop/product-cartegory/product-cartegory.module').then(m => m.ProductCartegoryModule),
  },
  {
    path: 'product-cartegory', loadChildren: () => import('./_tamshop/product-cartegory/product-cartegory.module').then(m => m.ProductCartegoryModule),
  },
  { path: 'footer', loadChildren: () => import('./footer/footer.module').then(m => m.FooterModule) },
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule) },
  { path: 'checkout-shop', loadChildren: () => import('./_tamshop/checkout-shop/checkout-shop.module').then(m => m.CheckoutShopModule) },
  { path: 'order-detail/:id', loadChildren: () => import('./_tamshop/order-detail/order-detail.module').then(m => m.OrderDetailModule), canActivate: [AuthGuard] },
  {
    path: 'admin/orders-report', loadChildren: () => import('./_tamshop/orders-list/orders-list.module').then(m => m.OrdersListModule),
    canActivate: [AuthGuard]
  },
  { path: 'about-site', loadChildren: () => import('./about-site/about-site.module').then(m => m.AboutSiteModule) },
  { path: 'signup', loadChildren: () => import('./user-registration/signup/signup.module').then(m => m.SignupModule) },
  { path: 'login', loadChildren: () => import('./user-registration/login/login.module').then(m => m.LoginModule) },
  { path: 'about-site/:id', loadChildren: () => import('./about-site/about-site.module').then(m => m.AboutSiteModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
