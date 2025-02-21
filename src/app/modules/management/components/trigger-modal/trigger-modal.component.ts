import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-trigger-modal',
  templateUrl: './trigger-modal.component.html',
  styleUrls: ['./trigger-modal.component.scss'],
  standalone: false
})
export class TriggerModalComponent {

  @Input() disable = false;
  isVisible: boolean = false;
  position: { top: string; right: string } = { top: '30px', right: '-90%' };

  constructor() {
    // this.show();
  }

  isModalShown = false; // Cờ để kiểm tra modal đã được hiển thị

  show() {
    this.isModalShown = false
    this.isVisible = true;
    setTimeout(() => {
      this.isModalShown = true
    }, 300);
  }

  hide() {
    if (this.isModalShown) {
      this.isModalShown = false;
      this.isVisible = false;
    }
  }
}
