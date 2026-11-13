import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utilService: UtilService
  ) { }

  userDetail: any = {};
  submitting = false;

  ngOnInit(): void {
  }

  async login(form: any) {
    if (this.submitting) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const mobile = String(this.userDetail.mobile || '').trim();
    if (!/^09\d{9}$/.test(mobile)) {
      this.utilService.showNotify('شماره موبایل معتبر نیست', "error");
      return;
    }

    this.submitting = true;
    try {
      const model = {
        userName: mobile,
        password: this.userDetail.password
      };
      const res: any = await this.mainService.login(model).toPromise();
      if (res && res['data'] != null && res['code'] == 200) {
        localStorage.setItem('token', res['data']);
        localStorage.setItem('userName', mobile);
        localStorage.setItem('isAdmin', res['message'] == "Admin" ? '1' : '0');

        const returnUrl = this.activeRoute.snapshot.queryParamMap.get('returnUrl');
        const safeReturnUrl = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/home';
        this.router.navigateByUrl(safeReturnUrl);
      } else {
        const msg = res?.['message'];
        this.utilService.showNotify(msg && msg !== 'Dont Have Access' ? msg : 'نام کاربری یا رمز عبور نادرست است', "error");
      }
    } catch (error: any) {
      const msg = error?.error?.message;
      this.utilService.showNotify(msg && msg !== 'Dont Have Access' ? msg : 'نام کاربری یا رمز عبور نادرست است', "error");
    } finally {
      this.submitting = false;
    }
  }

}
