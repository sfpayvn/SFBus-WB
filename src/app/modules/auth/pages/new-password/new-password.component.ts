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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Utils } from '@rsApp/shared/utils/utils';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { AuthService } from '../../service/auth.service';
import { NgClass } from '@angular/common';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { toast } from 'ngx-sonner';
import { RequestResetPassword } from '../../model/auth.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent, NgClass, NZModule],
})
export class NewPasswordComponent implements OnInit {
  form!: FormGroup;
  token: string = '';

  confirmPasswordVisible: boolean = false;
  passwordVisible: boolean = false;
  passwordFocused: boolean = false;

  passwordConditions: { [key: string]: boolean | number } = {
    minLength: false,
    hasWordCase: false,
    hasSpecial: false,
    hasNumber: false,
    noneSpace: false,
  };

  constructor(
    private _formBuilder: FormBuilder,
    private utils: Utils,
    private authService: AuthService,
    private _router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParamMap.pipe(map((p) => p.get('token'))).subscribe((token) => {
      this.token = token ?? '';
    });
  }

  initForm() {
    this.form = this._formBuilder.group(
      {
        password: [
          '@Solid2023',
          [
            Validators.required,
            this.optionalValidator(
              Validators.compose([Validators.minLength(8), this.passwordValidator.bind(this)]) || (() => null),
            ),
          ],
        ],
        confirmPassword: ['@Solid2023', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator, // Sử dụng form-level validator
      },
    );
  }

  get f() {
    return this.form.controls;
  }

  passwordMatchValidator = (formGroup: FormGroup) => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear error nếu passwords match
      const confirmPasswordControl = formGroup.get('confirmPassword');
      if (confirmPasswordControl?.errors?.['passwordMismatch']) {
        delete confirmPasswordControl.errors['passwordMismatch'];
        if (Object.keys(confirmPasswordControl.errors).length === 0) {
          confirmPasswordControl.setErrors(null);
        }
      }
    }
    return null;
  };

  optionalValidator(validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.trim() === '') {
        return null; // Không validate nếu không có giá trị
      }
      return validator(control); // Thực hiện validate khi có giá trị
    };
  }

  passwordValidator(control: any) {
    const value = control.value;
    this.passwordConditions['minLength'] = value.length >= 8;
    this.passwordConditions['hasWordCase'] = /[A-Z]/.test(value) && /[a-z]/.test(value);
    this.passwordConditions['hasNumber'] = /\d/.test(value);
    this.passwordConditions['hasSpecial'] = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    console.log('🚀 ~ SignUpComponent ~ passwordValidator ~ value:', value);
    this.passwordConditions['noneSpace'] = !/\s/.test(value);

    if (
      this.passwordConditions['minLength'] &&
      this.passwordConditions['hasWordCase'] &&
      this.passwordConditions['hasSpecial'] &&
      this.passwordConditions['hasNumber'] &&
      this.passwordConditions['noneSpace']
    ) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }

    const { password } = this.form.getRawValue();

    const requestResetPassword: RequestResetPassword = {
      token: this.token,
      newPassword: password,
    };

    this.authService.resetPassword(requestResetPassword).subscribe((res) => {
      if (res.error) {
        toast.error(res.error.message || res.message);
        return;
      }
      toast.success('Password has been reset successfully');
      this._router.navigate(['/auth/sign-in']);
    });
  }
}
