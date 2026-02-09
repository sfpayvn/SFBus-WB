import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error403',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error403.component.html',
  styleUrls: ['./error403.component.css'],
})
export class Error403Component {}
