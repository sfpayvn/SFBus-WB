import { NgIf, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { Utils } from '@rsApp/shared/utils/utils';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { A11yModule } from '@angular/cdk/a11y';
import { User } from '@rsApp/modules/management/modules/user-management/model/user.model';
import { AuthService } from '../../../auth/service/auth.service';
import { toast } from 'ngx-sonner';
import { CredentialService } from '@rsApp/shared/services/credential.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, AngularSvgIconModule, ButtonComponent, NZModule, A11yModule],
})
export class VerifyOtpComponent implements OnInit {
  form!: FormGroup;
  currentUser!: User;

  constructor(
    private _formBuilder: FormBuilder,
    private credentialService: CredentialService,
    private utils: Utils,
    private authService: AuthService,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  async initData() {
    this.currentUser = await this.credentialService.getCurrentUser();
  }

  initForm() {
    this.form = this._formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }

    const { otp } = this.form.getRawValue();

    this.authService.validateOtp(otp).subscribe(async (res: any) => {
      if (res.error) {
        toast.error(res.error.message);
        return;
      }
      await this.credentialService.updateCurrentUserField('isPhoneNumberVerified', true);
      this._router.navigate(['/']);
    });
  }
}
