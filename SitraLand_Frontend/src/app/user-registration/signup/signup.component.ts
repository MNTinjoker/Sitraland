import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  standalone: false,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService
  ) { }

  userDetail: any = {};
  submitting = false;

  ngOnInit(): void {
  }

  async singUp(form: any) {
    if (this.submitting) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const mobile = String(this.userDetail.mobile || '').trim();
    const fullName = String(this.userDetail.fullName || '').trim();
    const password = String(this.userDetail.password || '');
    if (!/^09\d{9}$/.test(mobile)) {
      this.utilService.showNotify('شماره موبایل معتبر نیست', "error");
      return;
    }
    if (!fullName) {
      this.utilService.showNotify('نام کاربری را وارد کنید', "error");
      return;
    }

    this.submitting = true;
    try {
      const model = {
        password: password,
        fullName: fullName,
        mobile: mobile
      };
      const res = await this.mainService.signUp(model).toPromise();
      const ok = res && (res['message'] == "User Created Successfully" || res['code'] == 200);
      if (ok) {
        this.utilService.showNotify('ثبت‌نام با موفقیت انجام شد', 'success');
        this.router.navigate(['/login']);
      } else {
        this.utilService.showNotify(res?.['message'] || 'ثبت‌نام انجام نشد', "error");
      }
    } catch (error) {
      this.utilService.showNotify("خطا در ثبت‌نام، دوباره تلاش کنید", "error");
    } finally {
      this.submitting = false;
    }
  }

}
