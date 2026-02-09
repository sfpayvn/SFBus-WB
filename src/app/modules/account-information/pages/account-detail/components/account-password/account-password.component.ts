import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Utils } from '@rsApp/shared/utils/utils';
import { toast } from 'ngx-sonner';
import { ROLE_CONSTANTS } from '@rsApp/core/constants/roles.constants';
import { AuthService } from '@rsApp/modules/auth/service/auth.service';
import { UpdatePasswordUserRequest } from '@rsApp/modules/auth/model/auth.model';

@Component({
  selector: 'app-account-password',
  templateUrl: './account-password.component.html',
  styleUrl: './account-password.component.scss',
  standalone: false,
})
export class AccountPasswordComponent implements OnInit {
  @Input() userId!: string;

  confirmPasswordVisible: boolean = false;
  oldPasswordVisible: boolean = false;

  passwordForm!: FormGroup;
  initialFormValue: any;

  passwordConditions: { [key: string]: boolean } = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  };

  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private utils: Utils, private authService: AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordValidator.bind(this),
          this.passwordNotSameAsOldValidator.bind(this),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });

    // Subscribe to value changes for password conditions
    this.passwordForm.get('password')?.valueChanges.subscribe((value) => {
      this.updatePasswordConditions(value);
      this.passwordForm.get('confirmPassword')?.updateValueAndValidity();
    });

    // Add custom validator for confirmPassword khi password thay đổi

    // Set custom validator cho confirmPassword
    this.passwordForm
      .get('confirmPassword')
      ?.setValidators([Validators.required, this.confirmPasswordValidator.bind(this)]);
    // Store initial value
    this.initialFormValue = JSON.parse(JSON.stringify(this.passwordForm.getRawValue()));
  }

  get f() {
    return this.passwordForm.controls;
  }

  confirmPasswordValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const password = this.passwordForm?.get('password')?.value;
    if (password && control.value !== password) {
      return { passwordMismatch: true };
    }
    return null;
  };

  passwordValidator(control: any) {
    const value = control.value;
    const passwordConditions: { [key: string]: boolean } = {
      minLength: value.length >= 8,
      hasWordCase: /[A-Z]/.test(value) && /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      noneSpace: !/\s/.test(value),
    };

    if (
      passwordConditions['minLength'] &&
      passwordConditions['hasWordCase'] &&
      passwordConditions['hasSpecial'] &&
      passwordConditions['hasNumber'] &&
      passwordConditions['noneSpace']
    ) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  passwordNotSameAsOldValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const oldPassword = this.passwordForm?.get('oldPassword')?.value;
    if (oldPassword && control.value === oldPassword) {
      return { passwordSameAsOld: true };
    }
    return null;
  };

  updatePasswordConditions(value: string) {
    this.passwordConditions['minLength'] = value.length >= 8;
    this.passwordConditions['hasWordCase'] = /[A-Z]/.test(value) && /[a-z]/.test(value);
    this.passwordConditions['hasNumber'] = /\d/.test(value);
    this.passwordConditions['hasSpecial'] = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    this.passwordConditions['noneSpace'] = !/\s/.test(value);
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.passwordForm.getRawValue();
    return JSON.stringify(this.initialFormValue) !== JSON.stringify(currentFormValue);
  }

  onSubmit() {
    if (!this.passwordForm.valid) {
      this.utils.markFormGroupTouched(this.passwordForm);
      return;
    }

    const { oldPassword, password } = this.passwordForm.getRawValue();

    const updatePasswordUserRequest: UpdatePasswordUserRequest = {
      oldPassword,
      password,
    };

    this.authService.updatePassword(updatePasswordUserRequest).subscribe({
      next: (res: any) => {
        toast.success('Password updated successfully');
        this.passwordForm.reset({
          oldPassword: '',
          password: '',
          confirmPassword: ''
        });
        this.initialFormValue = JSON.parse(JSON.stringify(this.passwordForm.getRawValue()));
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }
}
