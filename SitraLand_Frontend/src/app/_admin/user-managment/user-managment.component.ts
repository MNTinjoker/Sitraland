import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, Injectable, ChangeDetectionStrategy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

declare const $: any;

@Component({
  standalone: false,
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  roles = [];
  users;
  selectedId = -1;
  submit = false;
  showPreLoader = false;
  srchSubmit: boolean;
  editMode: boolean = false;
  model: any = [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private utilService: UtilService,
    private router: Router) { }

  async ngOnInit() {
    try {
      let roles = await this.mainService.getRoles().toPromise();
      this.roles = roles['data'];
    } catch {
      this.utilService.showNotify("خطا در دریافت اطلاعات", "error");
    }
  }




  async getUsers(role) {
    let users = await this.mainService.GetRoleBasedUsers(role).toPromise();
    this.users = users['data'];
  }

  async saveUser() {
    let model = {
      userName: this.model.name,
      role: this.model.Role
    }
    try {
      await this.mainService.addRoleToUser(model).toPromise();
      this.clear();
    } catch (error) {
      this.utilService.showNotify('خطا', "error");
      
    }

  }

  clear() {
    this.model.name = null;
    this.model.Role = null;
    this.model.phoneNumber = null;
    this.editMode = false;
  }




  selectedUser(user) {
    this.model.name = user['userName'];
    this.model.phoneNumber = user['phoneNumber'];
    this.model.Role = null;
    this.editMode = true;
  }




}
