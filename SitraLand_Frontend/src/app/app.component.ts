import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SitraLand';
  withOutMenu = ['/signup', '/login'];
  redesignPreview = false;

  constructor(private _router: Router,
    private http: HttpClient,
    private router: Router
  ) {
    this.router.events.subscribe((e) => {
      // if (window.location.pathname.indexOf('admin') !== -1) {
      this.notSeeMenu();
    });
  }
  footerLoaded: boolean = true;

  ngOnInit() {
    this.loadFoooter();
    const saved = localStorage.getItem('sitra-redesign-preview');
    this.redesignPreview = saved === '1';
    this.applyPreviewMode();
  }

  toggleRedesignPreview() {
    this.redesignPreview = !this.redesignPreview;
    localStorage.setItem('sitra-redesign-preview', this.redesignPreview ? '1' : '0');
    this.applyPreviewMode();
  }

  private applyPreviewMode() {
    const body = document.body;
    if (this.redesignPreview) {
      body.classList.add('sitra-redesign-preview');
    } else {
      body.classList.remove('sitra-redesign-preview');
    }
  }

  getIp() {
    this.http.get('https://api.ipify.org/?format=json').subscribe(
      (res: any) => {
        localStorage.setItem('ip', res.ip);
      },
      (error) => {

      });
  }
  notSeeMenu() {
    let url = location.pathname.split("?")[0];
    if (this.withOutMenu.includes(url)) {
      return true;
    }
    return false;
  }
  loadFoooter() {
    if (window.location.pathname.startsWith('/about-site')) {
      this.footerLoaded = true;
    }
    else {
      this.footerLoaded = true;
    }
  }

}

