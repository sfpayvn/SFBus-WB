import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bus-management',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './bus-management.component.html',
  styleUrl: './bus-management.component.scss',
})
export class BusManagementComponent {}
