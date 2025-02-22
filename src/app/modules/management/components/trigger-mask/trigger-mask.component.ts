import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trigger-mask',
  templateUrl: './trigger-mask.component.html',
  styleUrls: ['./trigger-mask.component.scss'],
  standalone: false
})
export class TriggerMaskComponent {

  @Input() disable = false;
  isVisible: boolean = false;
  position: { top: string; right: string } = { top: '30px', right: '-90%' };

  constructor() {
    // this.show();
  }


  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}
