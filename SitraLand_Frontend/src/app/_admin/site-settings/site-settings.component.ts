import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainService } from 'src/app/services/main.service';
import { SiteBrandingService } from 'src/app/services/site-branding.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  standalone: false,
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./site-settings.component.css']
})
export class SiteSettingsComponent implements OnInit {
  settings: any = {};
  categories: any[] = [];
  loading = true;
  savingKey: string | null = null;
  server = environment.url + '/images/';

  // Selected files/base64 previews per key/category
  selected: { [key: string]: { fileName: string; base64: string; preview?: string } } = {};

  brandingItems = [
    { key: 'navbarLogo', label: 'لوگوی نوار بالا (Navbar)', hint: 'لوگوی نمایش‌داده‌شده در هدر سایت' },
    { key: 'siteLogo', label: 'لوگوی اصلی سایت (ورود/ثبت‌نام)', hint: 'لوگوی اصلی که در صفحات ورود و ثبت‌نام نمایش داده می‌شود' },
    { key: 'heroBanner', label: 'بنر/تصویر اصلی صفحه خانه', hint: 'تصویر بزرگ بخش بالای صفحه اصلی' }
  ];

  constructor(
    private mainService: MainService,
    private brandingService: SiteBrandingService,
    private utilService: UtilService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.loadAll();
  }

  async loadAll() {
    this.loading = true;
    this.cdr.markForCheck();
    try {
      await this.brandingService.refresh();
      this.settings = { ...(this.brandingService.settings || {}) };
      const catRes: any = await this.mainService.getCategories().toPromise();
      this.categories = (catRes && catRes['data']) ? catRes['data'] : [];
    } catch {
      this.utilService.showNotify('خطا در دریافت تنظیمات', 'error');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  settingImageUrl(key: string): string {
    if (this.selected[key]?.preview) return this.selected[key].preview as string;
    const val = this.settings[key];
    return this.brandingService.imageUrl(val, '');
  }

  categoryImageUrl(cat: any): string {
    const sel = this.selected['cat_' + cat.categoryId];
    if (sel?.preview) return sel.preview as string;
    if (cat.imagePath) return this.server + cat.imagePath;
    return '';
  }

  async onFileChange(event: any, key: string) {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      const base64: any = await this.utilService.getBase64(file);
      const parts = String(base64).split(',');
      this.selected[key] = {
        fileName: file.name,
        base64: parts.length > 1 ? parts[1] : base64,
        preview: base64
      };
      this.cdr.markForCheck();
    } catch {
      this.utilService.showNotify('خطا در خواندن فایل', 'error');
    }
  }

  async saveBranding(key: string) {
    const sel = this.selected[key];
    if (!sel) {
      this.utilService.showNotify('ابتدا یک تصویر انتخاب کنید', 'error');
      return;
    }
    this.savingKey = key;
    this.cdr.markForCheck();
    try {
      const res: any = await this.mainService.saveSiteSetting({
        key,
        image: sel.base64,
        imageName: sel.fileName
      }).toPromise();
      if (res && (res['code'] == 200 || res['message'] == 'Success')) {
        this.utilService.showNotify('با موفقیت ذخیره شد', 'success');
        delete this.selected[key];
        await this.loadAll();
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا در ذخیره', 'error');
      }
    } catch (e: any) {
      this.utilService.showNotify(e?.error?.message || 'خطا در ذخیره', 'error');
    } finally {
      this.savingKey = null;
      this.cdr.markForCheck();
    }
  }

  async clearBranding(key: string) {
    const confirm = await this.utilService.sweetAlert({ message: 'تصویر فعلی حذف و به حالت پیش‌فرض برگردد؟' });
    if (!confirm || !confirm.value) return;
    this.savingKey = key;
    this.cdr.markForCheck();
    try {
      const res: any = await this.mainService.saveSiteSetting({ key, value: null }).toPromise();
      if (res && (res['code'] == 200 || res['message'] == 'Success')) {
        this.utilService.showNotify('به حالت پیش‌فرض بازگشت', 'success');
        delete this.selected[key];
        await this.loadAll();
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا', 'error');
      }
    } catch (e: any) {
      this.utilService.showNotify(e?.error?.message || 'خطا', 'error');
    } finally {
      this.savingKey = null;
      this.cdr.markForCheck();
    }
  }

  async saveCategoryImage(cat: any) {
    const key = 'cat_' + cat.categoryId;
    const sel = this.selected[key];
    if (!sel) {
      this.utilService.showNotify('ابتدا یک تصویر برای این دسته‌بندی انتخاب کنید', 'error');
      return;
    }
    this.savingKey = key;
    this.cdr.markForCheck();
    try {
      const res: any = await this.mainService.saveCategory({
        editOrNewId: cat.categoryId,
        categoryTitle: cat.categoryTitle,
        image: sel.base64,
        imageName: sel.fileName
      }).toPromise();
      if (res && (res['code'] == 200 || res['message'] == 'Success' || res['message'] == 'Updated' || res['data'] == 1)) {
        this.utilService.showNotify('تصویر دسته‌بندی ذخیره شد', 'success');
        delete this.selected[key];
        await this.loadAll();
      } else {
        this.utilService.showNotify(res?.['message'] || 'خطا در ذخیره', 'error');
      }
    } catch (e: any) {
      this.utilService.showNotify(e?.error?.message || 'خطا در ذخیره', 'error');
    } finally {
      this.savingKey = null;
      this.cdr.markForCheck();
    }
  }
}
