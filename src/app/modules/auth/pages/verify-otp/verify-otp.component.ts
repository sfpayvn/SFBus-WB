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
import { AuthService } from '../../service/auth.service';
import { toast } from 'ngx-sonner';
import { CredentialService } from '@rsApp/shared/services/credential.service';
import { AuthRescue, VerifyAuthRescue } from '../../model/auth.model';
import { UserService } from '@rsApp/shared/services/user.service';

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
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  async initData() {
    this.currentUser = await this.credentialService.getCurrentUser();
    console.log("🚀 ~ VerifyOtpComponent ~ initData ~ this.currentUser:", this.currentUser)
  }

  initForm() {
    this.form = this._formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  onResendOtp() {
    const authRescue: AuthRescue = {
      identifier: this.currentUser.phoneNumber,
      purpose: '2fa',
    };

    this.authService.requestAuthRescue(authRescue).subscribe((res) => {
      if (res.error) {
        toast.error(res.error.message || res.message);
        return;
      }
      toast.success('OTP has been resent successfully');
    });
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }

    const { otp } = this.form.getRawValue();

    const verifyAuthRescueDto: VerifyAuthRescue = {
      identifier: this.currentUser.phoneNumber,
      purpose: '2fa',
      token: otp,
    };

    try {
      const otpResult = await this.authService.validateOtp(verifyAuthRescueDto).toPromise();

      if (!otpResult || otpResult.error) {
        toast.error(otpResult?.error?.message || otpResult?.message || 'Xác thực OTP không thành công');
        return;
      }

      const updateResult = await this.userService
        .updateUserField(this.currentUser._id, 'isPhoneNumberVerified', true)
        .toPromise();

      if (updateResult !== true && (updateResult == null || (updateResult as any).error)) {
        toast.error(
          (updateResult as any)?.error?.message || (updateResult as any)?.message || 'Cập nhật trạng thái thất bại',
        );
        return;
      }

      await this.credentialService.updateCurrentUserField('isPhoneNumberVerified', true);
      this._router.navigate(['/']);
    } catch (err) {
      console.error('OTP verification error:', err);
      toast.error('Đã xảy ra lỗi trong quá trình xác thực, vui lòng thử lại sau.');
    }
  }
}
