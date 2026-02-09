import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-management',
  standalone: false,
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss'],
})
export class PaymentManagementComponent {
  constructor(private router: Router) {
    console.log('PaymentManagementComponent loaded!');
    console.log('Current URL:', this.router.url);
  }

  getCurrentPath(): string {
    return this.router.url;
  }
}
