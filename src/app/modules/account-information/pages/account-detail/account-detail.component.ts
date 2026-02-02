import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountInformationService } from '../../services/account-information.service';
import { Utils } from '@rsApp/shared/utils/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { AuthService } from '@rsApp/modules/auth/service/auth.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  standalone: false,
})
export class AccountDetailComponent implements OnInit, OnDestroy {
  accountInformation!: User;
  isLoaded: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountInformationService,
    private utils: Utils,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.isLoaded = false;
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: User) => {
          this.accountInformation = user;
          this.isLoaded = true;
        },
        error: (error: any) => {
          this.isLoaded = true;
          this.utils.handleRequestError(error);
        },
      });
  }

  backPage(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
