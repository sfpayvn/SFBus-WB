import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TranslateModule } from '@ngx-translate/core';
import { OrganizationService } from '@rsApp/core/services/organization.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, AngularSvgIconModule, RouterOutlet, TranslateModule],
})
export class AuthComponent implements OnInit {
  title$ = this.organizationService.organizationName$;

  constructor(private organizationService: OrganizationService) {}

  async ngOnInit(): Promise<void> {
    // Organization name will be loaded and updated automatically
  }
}
