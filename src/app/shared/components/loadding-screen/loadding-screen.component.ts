import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loadding-screen',
  templateUrl: './loadding-screen.component.html',
  styleUrl: './loadding-screen.component.scss',
  imports: [CommonModule],
})
export class LoaddingScreenComponent implements OnInit {
  @Input()
  detectRouteTransitions = false;

  loading$ = this.loadingService.loading$;

  constructor(public loadingService: LoadingService, private router: Router) {
    this.loadingService.loading$.subscribe((res: any) => {
      this.loading$ = res;
    });
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event: any) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          }),
        )
        .subscribe();
    }
  }
}
