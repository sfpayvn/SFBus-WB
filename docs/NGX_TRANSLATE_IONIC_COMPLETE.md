# NGX-Translate Setup for Ionic/Angular - Complete Guide

## Problem Statement
Translations showing as keys (e.g., `auth.signIn.helloAgain`) instead of translated values in Ionic/Angular app.

## Root Cause
The issue occurs when:
1. Translation files load asynchronously after components initialize and render
2. The translate pipe runs before translation data is available
3. APP_INITIALIZER doesn't properly wait for async operations

## Solution: Complete Implementation

### Step 1: Install Dependencies

```bash
npm install @ngx-translate/core
```

**Do NOT install** `@ngx-translate/http-loader` as it has compatibility issues with newer versions.

---

## Step 2: Create Translation Files

### Create Directory
```
src/
  assets/
    i18n/
      vi.json    (Vietnamese)
      en.json    (English)
```

### src/assets/i18n/vi.json
```json
{
  "auth": {
    "signIn": {
      "helloAgain": "Xin chào lại",
      "subtitle": "Nhập thông tin của bạn để truy cập tài khoản.",
      "phoneNumber": "Số điện thoại",
      "phoneNumberPlaceholder": "Nhập số điện thoại",
      "phoneNumberErrorRequired": "Vui lòng nhập số điện thoại",
      "phoneNumberErrorPattern": "Vui lòng nhập đúng số điện thoại",
      "tenantCode": "Mã Tenant",
      "tenantCodePlaceholder": "Nhập mã Tenant",
      "tenantCodeErrorRequired": "Vui lòng nhập mã Tenant",
      "password": "Mật khẩu",
      "passwordPlaceholder": "Nhập mật khẩu",
      "passwordErrorRequired": "Vui lòng nhập mật khẩu",
      "passwordErrorMinLength": "Mật khẩu tối thiểu 6 ký tự",
      "rememberMe": "Tự động đăng nhập",
      "forgotPassword": "Quên mật khẩu?",
      "signInButton": "Đăng nhập",
      "signInErrorInvalid": "Thông tin đăng nhập không hợp lệ",
      "signInErrorServer": "Lỗi máy chủ, vui lòng thử lại",
      "loading": "Đang xử lý..."
    }
  }
}
```

### src/assets/i18n/en.json
```json
{
  "auth": {
    "signIn": {
      "helloAgain": "Hello Again",
      "subtitle": "Enter your credentials to access your account.",
      "phoneNumber": "Phone Number",
      "phoneNumberPlaceholder": "Enter phone number",
      "phoneNumberErrorRequired": "Please enter phone number",
      "phoneNumberErrorPattern": "Please enter valid phone number",
      "tenantCode": "Tenant Code",
      "tenantCodePlaceholder": "Enter tenant code",
      "tenantCodeErrorRequired": "Please enter tenant code",
      "password": "Password",
      "passwordPlaceholder": "Enter password",
      "passwordErrorRequired": "Please enter password",
      "passwordErrorMinLength": "Password must be at least 6 characters",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "signInButton": "Sign In",
      "signInErrorInvalid": "Invalid credentials",
      "signInErrorServer": "Server error, please try again",
      "loading": "Processing..."
    }
  }
}
```

---

## Step 3: Create Language Service (CRITICAL)

### src/app/shared/services/language.service.ts

```typescript
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('vi');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private supportedLanguages = ['vi', 'en'];
  private initialized = false;
  private translationsLoaded: { [key: string]: boolean } = {};

  constructor(private translate: TranslateService, private http: HttpClient) {
    // Initialize tracking
    this.supportedLanguages.forEach(lang => {
      this.translationsLoaded[lang] = false;
    });
  }

  /**
   * PUBLIC METHOD: Initialize language and load all translation files
   * MUST be called before app renders
   * Returns Promise that resolves ONLY after all translations are loaded
   */
  public initLanguage(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    // Step 1: Set default language immediately
    this.translate.setDefaultLang('vi');

    // Step 2: Get saved language or use default
    const savedLang = localStorage.getItem('app-language') || 'vi';

    // Step 3: Load all translation files in parallel
    const translationRequests = this.supportedLanguages.map(lang =>
      this.loadTranslationFile(lang)
    );

    // Step 4: Wait for ALL files to load, THEN set the active language
    return forkJoin(translationRequests)
      .toPromise()
      .then(() => {
        // All translations loaded successfully
        this.setLanguage(savedLang);
        this.initialized = true;
        console.log('✓ All translations loaded successfully');
      })
      .catch(error => {
        // Error loading, but set default language anyway
        console.error('✗ Error loading translations:', error);
        this.translate.use('vi');
        this.initialized = true;
      });
  }

  /**
   * PRIVATE METHOD: Load a single translation file via HTTP
   * Returns Observable that completes when loaded
   */
  private loadTranslationFile(lang: string): Observable<any> {
    const translationFile = `./assets/i18n/${lang}.json`;
    
    return this.http.get<any>(translationFile).pipe(
      map((translations) => {
        // Register translations in ngx-translate
        this.translate.setTranslation(lang, translations, true);
        this.translationsLoaded[lang] = true;
        console.log(`✓ Loaded translations for: ${lang}`);
        return translations;
      }),
      catchError((error) => {
        console.error(`✗ Error loading ${lang} translations:`, error);
        // Set empty object as fallback
        this.translate.setTranslation(lang, {}, true);
        return of({});
      })
    );
  }

  /**
   * Switch the application language
   * @param lang - Language code (e.g., 'vi', 'en')
   */
  public setLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('app-language', lang);
      this.currentLanguageSubject.next(lang);
      console.log(`✓ Language switched to: ${lang}`);
    } else {
      console.warn(`✗ Unsupported language: ${lang}`);
    }
  }

  /**
   * Get the current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get available languages
   */
  public getAvailableLanguages(): string[] {
    return this.supportedLanguages;
  }

  /**
   * Get instant translation without Observable
   * WARNING: Only use AFTER initLanguage() completes
   * @param key - Translation key
   * @param params - Optional interpolation parameters
   */
  public instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  /**
   * Get translation as Observable
   * Safe to use anytime, returns Observable
   * @param key - Translation key or array of keys
   * @param params - Optional interpolation parameters
   */
  public get(key: string | string[], params?: any): Observable<any> {
    return this.translate.get(key, params);
  }

  /**
   * Check if all translations are loaded
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get translation with default fallback
   * @param key - Translation key
   * @param defaultValue - Fallback value if not found
   */
  public getTranslationOrDefault(key: string, defaultValue: string): Observable<any> {
    return this.translate.get(key);
  }
}
```

---

## Step 4: Configure App Module

### src/app/app.module.ts

```typescript
import { NgModule, APP_INITIALIZER, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

// Services
import { LanguageService } from './shared/services/language.service';
import { AuthService } from './app/auth/auth.service';

// Other imports...
import { AppComponent } from './app.component';

/**
 * APP_INITIALIZER Functions
 * These run before app renders
 */

// Initialize languages FIRST - must complete before auth
function initLanguages() {
  const languageService = inject(LanguageService);
  return languageService.initLanguage();
}

// Initialize auth AFTER languages
function initAuth() {
  const auth = inject(AuthService);
  return auth.init();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    // Configure TranslateModule with minimal settings
    TranslateModule.forRoot({
      defaultLanguage: 'vi',
    }),
    // App routing
    AppRoutingModule,
  ],
  providers: [
    // Load languages before app initializes
    {
      provide: APP_INITIALIZER,
      useFactory: initLanguages,
      multi: true,
    },
    // Load auth after languages
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

---

## Step 5: Configure Feature Module (Auth Module Example)

### src/app/modules/auth/auth.module.ts

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './pages/sign-in/sign-in.component';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    // Enable translate pipe for all templates in this module
    TranslateModule,
  ],
})
export class AuthModule {}
```

---

## Step 6: Use Translations in Templates

### src/app/modules/auth/pages/sign-in/sign-in.component.html

```html
<ion-content>
  <div class="signin-container">
    <!-- Heading with translation -->
    <h2>
      {{ 'auth.signIn.helloAgain' | translate }}
      <span>!</span>
    </h2>

    <!-- Subtitle with translation -->
    <p>{{ 'auth.signIn.subtitle' | translate }}</p>

    <!-- Form with labels and placeholders using translate pipe -->
    <form [formGroup]="signInForm" (ngSubmit)="onSubmit()">
      <!-- Phone Number Field -->
      <div class="form-group">
        <label>{{ 'auth.signIn.phoneNumber' | translate }}</label>
        <input
          type="text"
          formControlName="phoneNumber"
          [placeholder]="'auth.signIn.phoneNumberPlaceholder' | translate"
          class="input-field"
        />
        <div
          *ngIf="
            signInForm
              .get('phoneNumber')
              ?.hasError('required') &&
            signInForm.get('phoneNumber')?.touched
          "
          class="error-message"
        >
          {{ 'auth.signIn.phoneNumberErrorRequired' | translate }}
        </div>
      </div>

      <!-- Tenant Code Field -->
      <div class="form-group">
        <label>{{ 'auth.signIn.tenantCode' | translate }}</label>
        <input
          type="text"
          formControlName="tenantCode"
          [placeholder]="'auth.signIn.tenantCodePlaceholder' | translate"
          class="input-field"
        />
        <div
          *ngIf="
            signInForm
              .get('tenantCode')
              ?.hasError('required') &&
            signInForm.get('tenantCode')?.touched
          "
          class="error-message"
        >
          {{ 'auth.signIn.tenantCodeErrorRequired' | translate }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label>{{ 'auth.signIn.password' | translate }}</label>
        <input
          type="password"
          formControlName="password"
          [placeholder]="'auth.signIn.passwordPlaceholder' | translate"
          class="input-field"
        />
        <div
          *ngIf="
            signInForm
              .get('password')
              ?.hasError('required') &&
            signInForm.get('password')?.touched
          "
          class="error-message"
        >
          {{ 'auth.signIn.passwordErrorRequired' | translate }}
        </div>
      </div>

      <!-- Checkbox -->
      <div class="form-group checkbox">
        <input
          type="checkbox"
          id="rememberMe"
          formControlName="rememberMe"
        />
        <label for="rememberMe">
          {{ 'auth.signIn.rememberMe' | translate }}
        </label>
      </div>

      <!-- Forgot Password Link -->
      <a href="#" class="forgot-password">
        {{ 'auth.signIn.forgotPassword' | translate }}
      </a>

      <!-- Submit Button -->
      <button
        type="submit"
        class="signin-button"
        [disabled]="signInForm.invalid || isLoading"
      >
        <span *ngIf="!isLoading">
          {{ 'auth.signIn.signInButton' | translate }}
        </span>
        <span *ngIf="isLoading">
          {{ 'auth.signIn.loading' | translate }}
        </span>
      </button>
    </form>
  </div>
</ion-content>
```

---

## Step 7: Component TypeScript

### src/app/modules/auth/pages/sign-in/sign-in.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.signInForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]],
      tenantCode: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.signInForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { phoneNumber, tenantCode, password, rememberMe } =
      this.signInForm.value;

    this.authService
      .signIn(phoneNumber, tenantCode, password, rememberMe)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Handle success
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.languageService.instant(
            'auth.signIn.signInErrorInvalid'
          );
        },
      });
  }

  // Method to change language (optional)
  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}
```

---

## Step 8: Optional - Language Selector Component

### src/app/shared/components/language-selector/language-selector.component.ts

```typescript
import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  template: `
    <ion-buttons>
      <ion-button
        *ngFor="let lang of languages"
        [class.active]="isCurrentLanguage(lang)"
        (click)="selectLanguage(lang)"
      >
        {{ lang.toUpperCase() }}
      </ion-button>
    </ion-buttons>
  `,
  styles: [
    `
      ion-button.active {
        font-weight: bold;
        color: var(--ion-color-primary);
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  languages: string[] = [];

  constructor(private languageService: LanguageService) {
    this.languages = this.languageService.getAvailableLanguages();
  }

  selectLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }

  isCurrentLanguage(lang: string): boolean {
    return this.languageService.getCurrentLanguage() === lang;
  }
}
```

---

## Verification Checklist

### Installation
- [ ] `npm install @ngx-translate/core` completed
- [ ] `@ngx-translate/http-loader` NOT installed
- [ ] No TypeScript errors on build

### Files Created
- [ ] `src/assets/i18n/vi.json` exists with all keys
- [ ] `src/assets/i18n/en.json` exists with all keys
- [ ] `src/app/shared/services/language.service.ts` created

### Configuration
- [ ] `TranslateModule` imported in app.module.ts
- [ ] `HttpClientModule` imported in app.module.ts
- [ ] `APP_INITIALIZER` for `initLanguages()` configured
- [ ] `TranslateModule` imported in feature modules (auth.module.ts)

### Templates
- [ ] All user-facing strings use `{{ 'key' | translate }}` pipe
- [ ] Placeholder attributes use `[placeholder]="'key' | translate"`
- [ ] No hardcoded English/Vietnamese text in templates

### Testing
- [ ] Build succeeds: `npm run build --configuration development`
- [ ] Dev server starts: `npm start`
- [ ] Sign-in page displays "Xin chào lại" (not "auth.signIn.helloAgain")
- [ ] All labels, buttons, and placeholders show translated text
- [ ] Switching language changes all text immediately

---

## Common Issues & Solutions

### Issue 1: Translation keys still showing in UI
**Cause:** Translations loading after component renders  
**Solution:** Ensure `initLanguage()` returns a Promise and completes before app renders

### Issue 2: "Expected 0 arguments" error
**Cause:** Using `@ngx-translate/http-loader` with incompatible API  
**Solution:** Remove http-loader, use manual HTTP loading in LanguageService

### Issue 3: Placeholders empty or showing keys
**Cause:** Using string interpolation instead of property binding  
**Fix Example:**
```html
<!-- WRONG -->
<input placeholder="{{ 'key' | translate }}" />

<!-- CORRECT -->
<input [placeholder]="'key' | translate" />
```

### Issue 4: Language selector doesn't update all components
**Cause:** Components not subscribed to language changes  
**Solution:** Use `currentLanguage$` Observable in components that need dynamic updates:
```typescript
this.languageService.currentLanguage$.subscribe(lang => {
  // Refresh component when language changes
});
```

### Issue 5: Build succeeds but no translations in browser
**Cause:** JSON files not copied to build output  
**Solution:** Ensure `angular.json` assets configuration includes:
```json
"assets": [
  "src/favicon.ico",
  "src/assets"  // This line is critical
]
```

---

## Console Logging for Debugging

The LanguageService includes console logs to help debug:

```
✓ All translations loaded successfully
✓ Loaded translations for: vi
✓ Loaded translations for: en
✓ Language switched to: vi
✗ Error loading XX translations: [error details]
```

Check browser console (F12) to verify translations are loading correctly.

---

## Best Practices

1. **Always use translate pipe in templates** - Never hardcode text
2. **Organize keys hierarchically** - Use nested objects for related translations
3. **Load all languages on app init** - Not on-demand to avoid delays
4. **Use `instant()` after init** - For imperative translation in TypeScript
5. **Subscribe to `currentLanguage$`** - For dynamic UI updates
6. **Cache in localStorage** - Remember user's language preference
7. **Test with AT LEAST 2 languages** - Ensures pipes and placeholders work

---

## Files Summary

```
src/
├── assets/
│   └── i18n/
│       ├── vi.json          ✓ Vietnamese translations
│       └── en.json          ✓ English translations
├── app/
│   ├── app.module.ts        ✓ TranslateModule + APP_INITIALIZER
│   ├── shared/
│   │   ├── services/
│   │   │   └── language.service.ts  ✓ Language management
│   │   └── components/
│   │       └── language-selector/   ✓ Language switcher
│   └── modules/
│       └── auth/
│           ├── auth.module.ts       ✓ TranslateModule import
│           └── pages/
│               └── sign-in/
│                   ├── sign-in.component.ts    ✓ Form + Language service
│                   └── sign-in.component.html  ✓ All strings translated
```

---

## Expected Result

After implementing all steps:

```
Page loads → LanguageService.initLanguage() called
           → All JSON files loaded via HTTP in parallel
           → forkJoin waits for all to complete
           → APP_INITIALIZER Promise resolved
           → Components render with loaded translations
           → UI displays: "Xin chào lại" ✓ (not translation keys)
```

---

**Last Updated:** March 2026  
**Angular:** 20.0.6  
**Ionic:** 8.6.3  
**ngx-translate/core:** 14.0.0+
