import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { UtilService } from './services/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _router: Router, private utilService: UtilService
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let token = localStorage.getItem('token');
    if (token != null) {
      return true;
    } else {
      this._router.navigate(['/home']);
      return false;
    }
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
  }
}

