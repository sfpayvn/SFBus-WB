import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { ThemeService } from './core/services/theme.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
import { LoaddingScreenComponent } from './shared/components/loadding-screen/loadding-screen.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster, LoaddingScreenComponent],
})
export class AppComponent {
  protected readonly toast = toast;
  title = 'Angular Tailwind';

  constructor(public themeService: ThemeService) { }
}
