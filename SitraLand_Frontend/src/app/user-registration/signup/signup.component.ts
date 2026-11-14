import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { SiteBrandingService } from 'src/app/services/site-branding.service';
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
    private utilService: UtilService,
    private brandingService: SiteBrandingService
  ) { }

  userDetail: any = {};
  submitting = false;
  logo = '../../../assets/images/logo.webp';

  ngOnInit(): void {
    this.brandingService.ensureLoaded().then(() => {
      const s = this.brandingService.settings || {};
      this.logo = this.brandingService.imageUrl(s['siteLogo'] || s['navbarLogo'], '../../../assets/images/logo.webp');
    });
  }

  private normalizeMobile(value: string): string | null {
    if (!value) return null;
    let v = value.replace(/^\+/, '');
    const fa = '۰۱۲۳۴۵۶۷۸۹', ar = '٠١٢٣٤٥٦٧٨٩';
    for (let i = 0; i < 10; i++) {
      v = v.split(fa[i]).join(String(i)).split(ar[i]).join(String(i));
    }
    if (/^09\d{9}$/.test(v)) return v;
    if (/^9\d{9}$/.test(v)) return '0' + v;
    if (/^989\d{9}$/.test(v)) return '0' + v.substring(2);
    if (/^00989\d{9}$/.test(v)) return '0' + v.substring(4);
    return null;
  }

  private formatSignupError(res: any): string {
    if (!res) {
      return 'ثبت‌نام انجام نشد';
    }
    const msg = res['message'];
    if (msg === 'This mobile number is already registered') {
      return 'این شماره موبایل قبلاً ثبت شده است';
    }
    if (msg === 'Could not create user') {
      const errors = res['data'];
      if (Array.isArray(errors) && errors.length) {
        const descriptions = errors.map((e: any) => e?.description || e?.code).filter(Boolean);
        if (descriptions.length) {
          return descriptions.join('، ');
        }
      }
      return 'رمز عبور باید حداقل ۶ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد';
    }
    if (typeof msg === 'string' && msg) {
      return msg;
    }
    return 'ثبت‌نام انجام نشد';
  }

  async singUp(form: any) {
    if (this.submitting) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const rawMobile = String(this.userDetail.mobile || '').trim().replace(/[\s\-()]/g, '');
    const mobile = this.normalizeMobile(rawMobile);
    const fullName = String(this.userDetail.fullName || '').trim();
    const password = String(this.userDetail.password || '');
    if (!mobile) {
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
      const res: any = await this.mainService.signUp(model).toPromise();
      const ok = res && (res['message'] == "User Created Successfully" || res['code'] == 200);
      if (ok) {
        this.utilService.showNotify('ثبت‌نام با موفقیت انجام شد', 'success');
        this.router.navigate(['/login']);
      } else {
        const msg = this.formatSignupError(res);
        this.utilService.showNotify(msg, "error");
      }
    } catch (error: any) {
      const msg = this.formatSignupError(error?.error) || 'خطا در ثبت‌نام، دوباره تلاش کنید';
      this.utilService.showNotify(msg, "error");
    } finally {
      this.submitting = false;
    }
  }

}
