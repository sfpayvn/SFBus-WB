import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Utils } from '@rsApp/shared/utils/utils';
import { AuthRescue, SignUp } from '../../model/auth.model';
import { AuthService } from '../../service/auth.service';
import { toast } from 'ngx-sonner';
import { CustomCommonModule } from '@rsApp/library-modules/custom-common-module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [CustomCommonModule, NgxMaskDirective, TranslateModule],
  providers: [provideNgxMask()],
})
export class SignUpComponent implements OnInit {
  maskConfig = {
    dropSpecialCharacters: true,
    showMaskTyped: true,
  };

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
        tenantName: ['', [Validators.required]],
        tenantCode: [{ disabled: true, value: '' }, [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)]],
        password: [
          '',
          [
            Validators.required,
            this.optionalValidator(
              Validators.compose([Validators.minLength(8), this.passwordValidator.bind(this)]) || (() => null),
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        acceptTerm: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator, // Use form-level validator
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
      // Clear error if passwords match
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
        return null; // Do not validate if no value
      }
      return validator(control); // Perform validation when value exists
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

  // Add method to remove Vietnamese diacritics
  removeDiacritics(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
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
