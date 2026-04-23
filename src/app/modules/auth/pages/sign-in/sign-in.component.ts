import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { toast } from 'ngx-sonner';
import { Utils } from '@rsApp/shared/utils/utils';
import { CustomCommonModule } from '@rsApp/library-modules/custom-common-module';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [CustomCommonModule, NgxMaskDirective, TranslateModule],
  providers: [provideNgxMask()],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  passwordVisible: boolean = false;

  maskConfig = {
    dropSpecialCharacters: true,
    showMaskTyped: true,
  };

  private readonly REMEMBER_ME_KEY = 'rememberMeCredentials';
  private readonly SESSION_ACTIVE_FLAG = 'sessionActiveFlag';

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
    const savedCredentials = this.getSavedCredentials();
    
    this.form = this._formBuilder.group({
      phoneNumber: [
        savedCredentials?.phoneNumber || '',
        [Validators.required, Validators.pattern(this.utils.VN_MOBILE_REX)], // Do not use /.../g
      ],
      tenantCode: [savedCredentials?.tenantCode || '', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [savedCredentials ? true : true],
    });
  }

  private getSavedCredentials(): any {
    try {
      const saved = localStorage.getItem(this.REMEMBER_ME_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private saveCredentials(phoneNumber: string, tenantCode: string, rememberMe: boolean): void {
    // Remember Me: Save credentials to localStorage
    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_ME_KEY, JSON.stringify({ phoneNumber, tenantCode }));
    } else {
      localStorage.removeItem(this.REMEMBER_ME_KEY);
    }
    
    // Always set session flag when logging in (sessionStorage clears when browser closes)
    sessionStorage.setItem(this.SESSION_ACTIVE_FLAG, 'true');
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.utils.markFormGroupTouched(this.form);
      return;
    }
    const { phoneNumber, password, tenantCode, rememberMe } = this.form.value;

    this.login(phoneNumber, password, tenantCode, rememberMe);
  }

  login(phoneNumber: string, password: string, tenantCode: string, rememberMe: boolean) {
    this.authService.login(phoneNumber, password, tenantCode).subscribe(
      async (res: any) => {
        if (res.error) {
          toast.error(res.error.message || res.message);
          return;
        }
        
        // Save credentials if Remember Me is checked
        this.saveCredentials(phoneNumber, tenantCode, rememberMe);
        
        this._router.navigate(['/']);
      },
      (error) => {
        if (error && error.error && error.error.message) {
          toast.error(error.error.message);
          return;
        }
      },
    );
  }
}
