import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two-steps',
  templateUrl: './two-steps.component.html',
  styleUrls: ['./two-steps.component.css'],
  imports: [FormsModule],
})
export class TwoStepsComponent implements OnInit {
  constructor() {}
  public inputs = Array(6);

  ngOnInit(): void {}
}
