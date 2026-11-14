import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { MainService } from './main.service';

@Injectable({
  providedIn: 'root'
})
export class SiteBrandingService {
  private settingsSubject = new BehaviorSubject<{ [key: string]: string | null }>({});
  settings$ = this.settingsSubject.asObservable();
  private loaded = false;
  private loading: Promise<void> | null = null;

  constructor(private mainService: MainService) { }

  async ensureLoaded(force = false): Promise<{ [key: string]: string | null }> {
    if (this.loaded && !force) {
      return this.settingsSubject.value;
    }
    if (this.loading && !force) {
      await this.loading;
      return this.settingsSubject.value;
    }

    this.loading = (async () => {
      try {
        const res: any = await this.mainService.getSiteSettings().toPromise();
        const data = (res && res['data']) ? res['data'] : {};
        this.settingsSubject.next(data || {});
        this.loaded = true;
      } catch {
        // Keep defaults on failure.
      } finally {
        this.loading = null;
      }
    })();

    await this.loading;
    return this.settingsSubject.value;
  }

  get settings(): { [key: string]: string | null } {
    return this.settingsSubject.value || {};
  }

  imageUrl(path?: string | null, fallback?: string): string {
    if (path) {
      if (/^https?:\/\//i.test(path)) {
        return path;
      }
      return environment.url + '/images/' + path.replace(/^\/+/, '');
    }
    return fallback || '';
  }

  async refresh(): Promise<void> {
    this.loaded = false;
    await this.ensureLoaded(true);
  }
}
