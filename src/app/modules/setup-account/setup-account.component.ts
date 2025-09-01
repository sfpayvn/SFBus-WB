import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-setup-account',
  templateUrl: './setup-account.component.html',
  styleUrls: ['./setup-account.component.css'],
  imports: [RouterOutlet, AngularSvgIconModule],
})
export class SetupAccountComponent {}
