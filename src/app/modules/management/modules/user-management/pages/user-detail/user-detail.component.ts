import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utils } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { User, UserAddress } from '../../model/user.model';
import { UtilsModal } from 'src/app/shared/utils/utils-modal';
import _ from 'lodash';
import { Driver } from '../../model/driver.model';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  standalone: false,
})
export class UserDetailComponent implements OnInit {
  user!: User;

  addresses!: UserAddress[];
  showDriverTab: boolean = false;

  constructor(
    private fb: FormBuilder,
    public utils: Utils,
    private location: Location,
    private utilsModal: UtilsModal,
  ) {}

  ngOnInit(): void {
    this.getQueryParams();
  }

  async getQueryParams() {
    const params = history.state;
    if (params && params['user']) {
      this.user = params['user'] ? JSON.parse(params['user']) : null;
    }
  }

  backPage() {
    this.location.back();
  }

  onRolesChange(roles: string[]) {
    this.showDriverTab = roles.includes('driver');
  }

  onCreateUser(user: User) {
    this.user = user;
    this.onRolesChange(this.user.roles || []);
  }
}
