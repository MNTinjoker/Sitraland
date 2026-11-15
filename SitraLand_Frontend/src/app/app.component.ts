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
    // The UI redesign (v2) is the only design now. Its CSS lives in
    // assets/sl-redesign.js and the "sl-v2" class is set in index.html.
    // Only the keys of the old preview builds are cleaned up here.
    localStorage.removeItem('sl-v2');
    localStorage.removeItem('sitra-redesign-preview');
    document.body.classList.add('sl-v2');
    document.body.classList.remove('sitra-redesign-preview');
    document.documentElement.classList.remove('sitra-redesign-preview');
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

