import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../service/auth.service';
import { toast } from 'ngx-sonner';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { Utils } from '@rsApp/shared/utils/utils';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, ButtonComponent, NZModule],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  passwordVisible: boolean = false;


  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private authService: AuthService,
    private utils: Utils,
  ) {}

  onClick() {
    console.log('Button clicked');
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      phoneNumber: [
        '0961090433',
        [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)], // KHÔNG dùng /.../g
      ],
      tenantCode: ['sf', [Validators.required]],
      password: ['@Solid2023', Validators.required],
      rememberMe: [false],
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
    const { phoneNumber, password, tenantCode } = this.form.value;

    this.login(phoneNumber, password, tenantCode);
  }

  login(phoneNumber: string, password: string, tenantCode: string) {
    this.authService.login(phoneNumber, password, tenantCode).subscribe(
      async (res: any) => {
        if (res.error) {
          toast.error(res.error.message || res.message);
          return;
        }
        this._router.navigate(['/']);
      },
      (error) => {
        toast.error('Login failed. Please try again.');
      },
    );
  }
}
