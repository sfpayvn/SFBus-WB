import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { Utils } from '@rsApp/shared/utils/utils';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { AuthService } from '../../service/auth.service';
import { RequestForgotPassword } from '../../model/auth.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent, NZModule],
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private utils: Utils, private authService: AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._formBuilder.group({
      phoneNumber: ['0961090433', [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }

    const { phoneNumber } = this.form.value;

    const requestForgotPassword: RequestForgotPassword = {
      phoneNumber,
      redirectBaseUrl: 'http://localhost:4200/auth/new-password',
    };

    this.authService.forgotPassword(requestForgotPassword).subscribe((res) => {
      if (res.error) {
        toast.error(res.error.message || res.message);
        return;
      }
      toast.success('Link reset password has been resent successfully');
    });
  }
}
