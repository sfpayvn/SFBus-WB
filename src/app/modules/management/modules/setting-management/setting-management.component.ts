import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-management',
  standalone: false,
  templateUrl: './setting-management.component.html',
  styleUrls: ['./setting-management.component.scss'],
})
export class SettingManagementComponent {
  constructor(private router: Router) {
    console.log('SettingManagementComponent loaded!');
    console.log('Current URL:', this.router.url);
  }

  getCurrentPath(): string {
    return this.router.url;
  }
}
