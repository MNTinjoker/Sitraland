import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService
  ) { }

  userDetail: any = {};

  ngOnInit(): void {
  }


  async singUp(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    try {
      let model = {
        password: this.userDetail.password,
        fullName: this.userDetail.fullName,
        mobile: this.userDetail.mobile
      }
      let res = await this.mainService.signUp(model).toPromise();
      if (res['message'] == "User Created Successfully") {
        this.utilService.showNotify('ثبت‌نام با موفقیت انجام شد', 'success');
        this.router.navigate(['/login']);
      } else {
        this.utilService.showNotify(res['message'] || 'خطا', "error");
      }
    } catch (error) {
      this.utilService.showNotify("خطا", "error");
    }
  }

}
