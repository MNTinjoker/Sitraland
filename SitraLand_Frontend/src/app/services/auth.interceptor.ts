import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private handlingAuthError = false;

  constructor(
    private router: Router,
    private notifier: NotifierService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const isApiRequest = req.url.startsWith(environment.url) || req.url.startsWith('/api/');

    if (token && isApiRequest && !req.headers.has('Authorization')) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (isApiRequest && (error.status === 401 || error.status === 403)) {
          this.handleAuthError(error.status);
        }
        return throwError(() => error);
      })
    );
  }

  private handleAuthError(status: number) {
    const url = this.router.url || '';
    if (url.startsWith('/login') || url.startsWith('/signup')) {
      return;
    }

    this.clearSession();

    if (this.handlingAuthError) {
      return;
    }

    this.handlingAuthError = true;
    const message = status === 401
      ? 'نشست شما منقضی شده است، دوباره وارد شوید'
      : 'دسترسی لازم برای این بخش را ندارید';
    this.notifier.notify(status === 401 ? 'warning' : 'error', message);

    const returnUrl = url && url !== '/login' ? url : '/home';
    this.router.navigate(['/login'], { queryParams: status === 401 ? { returnUrl } : undefined })
      .finally(() => { this.handlingAuthError = false; });
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
  }
}
