import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private utilService:UtilService
  ) { }

  userDetail: any = {};
  ngOnInit(): void {
  }


  async login(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    try {
      let model = {
        userName: this.userDetail.mobile,
        password: this.userDetail.password
      }
      let res = await this.mainService.login(model).toPromise();
      if (res['data'] != null) {
        localStorage.setItem('token', res['data']);
        localStorage.setItem('userName', this.userDetail.mobile);
        if (res['message'] == "Admin") {
          localStorage.setItem('isAdmin', '1');
        } else {
          localStorage.setItem('isAdmin', '0');
        }
        this.router.navigate(['/home']);
      }
      else {
        this.utilService.showNotify('خطا', "error");

      }
    } catch (error) {
      this.utilService.showNotify('خطا', "error");

    }
  }

}
