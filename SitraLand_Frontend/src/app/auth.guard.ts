import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === '1';

    if (token && isAdmin) {
      return true;
    }

    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  clear() {
    localStorage.removeItem('secret');
    localStorage.removeItem('schoolId');
    localStorage.removeItem('operator');
    localStorage.removeItem('jwt');
    localStorage.removeItem('userLoginId');
    localStorage.removeItem('username');
    localStorage.removeItem('regionId');
    localStorage.removeItem('mobile');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  }
}
