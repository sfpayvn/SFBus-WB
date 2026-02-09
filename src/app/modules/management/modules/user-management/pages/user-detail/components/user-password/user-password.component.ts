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
import { UserManagementService } from '../../../../service/user.servive';
import { ROLE_CONSTANTS } from '@rsApp/core/constants/roles.constants';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrl: './user-password.component.scss',
  standalone: false,
})
export class UserPasswordComponent implements OnInit {
  @Input() userId!: string;
  @Input() userRole: string = ROLE_CONSTANTS.CLIENT;

  passwordForm!: FormGroup;
  initialFormValue: any;

  passwordConditions: { [key: string]: boolean } = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  };

  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private utils: Utils, private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator.bind(this)]],
    });

    // Subscribe to value changes for password conditions
    this.passwordForm.get('password')?.valueChanges.subscribe((value) => {
      this.updatePasswordConditions(value);
    });

    // Store initial value
    this.initialFormValue = JSON.parse(JSON.stringify(this.passwordForm.getRawValue()));
  }

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

    const { password } = this.passwordForm.getRawValue();
    try {
      this.userManagementService.setPassword(this.userRole, this.userId, password).subscribe({
        next: (response: any) => {
          toast.success('Mật khẩu đã được cập nhật thành công');
          this.passwordForm.markAsPristine();
          this.initialFormValue = JSON.parse(JSON.stringify(this.passwordForm.getRawValue()));
        },
        error: (error: any) => this.utils.handleRequestError(error?.error),
      });
    } catch (err: any) {
      this.utils.handleRequestError(err.error);
    }
  }
}
