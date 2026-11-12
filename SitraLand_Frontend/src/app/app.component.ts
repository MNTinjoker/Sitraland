import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
    this.loadFoooter()
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

