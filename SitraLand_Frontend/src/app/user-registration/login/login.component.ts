import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { SiteBrandingService } from 'src/app/services/site-branding.service';
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
    // Convert Persian/Arabic digits just in case
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

  async login(form: any) {
    if (this.submitting) {
      return;
    }
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const rawMobile = String(this.userDetail.mobile || '').trim().replace(/[\s\-()]/g, '');
    const normalized = this.normalizeMobile(rawMobile);
    if (!normalized) {
      this.utilService.showNotify('شماره موبایل معتبر نیست', "error");
      return;
    }

    this.submitting = true;
    try {
      const model = {
        userName: normalized,
        password: this.userDetail.password
      };
      const res: any = await this.mainService.login(model).toPromise();
      if (res && res['data'] != null && res['code'] == 200) {
        localStorage.setItem('token', res['data']);
        localStorage.setItem('userName', normalized);
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
