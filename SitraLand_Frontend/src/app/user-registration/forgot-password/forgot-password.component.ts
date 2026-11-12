import { Component, OnInit, ViewChild } from '@angular/core';
import { CdTimerComponent } from 'angular-cd-timer';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  // @ViewChild('timerforEmail', { static: false })
  // cdTimer!: CdTimerComponent;
  @ViewChild(CdTimerComponent) timerComponent: CdTimerComponent | undefined;

  time = 300;
  sendEmail: boolean = false;
  constructor() { }

  ngOnInit(): void {

  }

  stopTimer() {
    this.timerComponent?.reset();
  }

  confirm() {
    this.timerComponent?.reset();
    this.timerComponent?.start();
    this.sendEmail = true;
  }

}
