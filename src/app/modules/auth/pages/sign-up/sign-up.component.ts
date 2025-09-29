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
import { AuthRescue, SignUp } from '../../model/auth.model';
import { AuthService } from '../../service/auth.service';
import { toast } from 'ngx-sonner';
import { CredentialService } from '@rsApp/shared/services/credential.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent, NgClass, NZModule],
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
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
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this._formBuilder.group(
      {
        tenantName: ['SF', [Validators.required]],
        tenantCode: [{ disabled: true, value: 'SF' }, [Validators.required]],
        phoneNumber: ['0961090433', [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
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
        acceptTerm: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator, // Sử dụng form-level validator
      },
    );
  }

  get f() {
    return this.form.controls;
  }

  // Form-level validator
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

  updateTenantCode() {
    const tenantName = this.f['tenantName'].value;
    const normalizedName = this.removeDiacritics(tenantName.trim().toLowerCase().replace(/\s+/g, ''));
    this.f['tenantCode'].patchValue(normalizedName);
  }

  // Thêm method để bỏ dấu tiếng Việt
  removeDiacritics(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }

    const { tenantName, tenantCode, phoneNumber, password } = this.form.value;

    const signUp: SignUp = {
      tenantName,
      tenantCode: this.removeDiacritics(tenantName.trim().toLowerCase().replace(/\s+/g, '')),
      phoneNumber,
      password,
    };
    console.log('🚀 ~ SignUpComponent ~ onSubmit ~ signUp:', signUp);

    this.authService.signUp(signUp, false).subscribe(async (res: any) => {
      if (res.error) {
        toast.error(res.error.message || res.message);
        return;
      }

      const authRescue: AuthRescue = {
        identifier: phoneNumber,
        purpose: '2fa',
      };

      this.authService.requestAuthRescue(authRescue).subscribe((res) => {
        if (res.error) {
          toast.error(res.error.message || res.message);
          return;
        }
        this._router.navigate(['/auth/verify-otp']);
      });
    });
  }
}
