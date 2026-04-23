# Hướng Dẫn Triển Khai ngx-translate trong Ionic

## Mục Lục
1. [Giới Thiệu](#giới-thiệu)
2. [Cài Đặt](#cài-đặt)
3. [Cấu Hình Ban Đầu](#cấu-hình-ban-đầu)
4. [Thiết Lập i18n](#thiết-lập-i18n)
5. [Sử Dụng trong Components](#sử-dụng-trong-components)
6. [Thay Đổi Ngôn Ngữ Động](#thay-đổi-ngôn-ngữ-động)
7. [Best Practices cho Ionic](#best-practices-cho-ionic)
8. [Troubleshooting](#troubleshooting)

---

## Giới Thiệu

**ngx-translate** là thư viện quốc tế hóa (i18n) cho Angular/Ionic, cho phép ứng dụng hỗ trợ nhiều ngôn ngữ theo cách động.

### Ưu Điểm
- ✅ Hỗ trợ đa ngôn ngữ động (không cần rebuild)
- ✅ Lazy loading JSON translation files
- ✅ Interpolation biến trong translation strings
- ✅ Pluralization support
- ✅ Tích hợp với Angular dễ dàng

---

## Cài Đặt

### Bước 1: Cài Đặt Packages

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

### Bước 2: Cài Đặt Dependencies Cần Thiết

```bash
npm install @angular/common @angular/platform-browser
```

---

## Cấu Hình Ban Đầu

### Trong `main.ts` (Ionic Standalone App - Angular 14+)

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { InicComponent } from './app/app.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(IonicComponent, {
  providers: [
    // Standard Ionic providers
    provideIonics(),
    
    // ngx-translate configuration
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: 'vi', // Ngôn ngữ mặc định
        addedLanguages: ['en', 'vi'], // Các ngôn ngữ khác
      })
    ),
    
    // HTTP Loader cho ngx-translate
    ...provideTranslateHttpLoader({
      prefix: './assets/i18n/', // Thư mục chứa JSON
      suffix: '.json',           // Extension file
    }),
  ],
}).catch(err => console.error(err));
```

### Hoặc trong `app.module.ts` (Nếu Dùng NgModule)

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'vi',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/', // Prefix
    '.json'            // Suffix
  );
}
```

---

## Thiết Lập i18n

### Bước 1: Tạo Cấu Trúc Thư Mục

```
src/
├── assets/
│   └── i18n/
│       ├── en.json        # English translations
│       ├── vi.json        # Vietnamese translations
│       └── fr.json        # French translations (tùy chọn)
```

### Bước 2: Tạo File Translation

**src/assets/i18n/vi.json**
```json
{
  "common": {
    "home": "Trang Chủ",
    "dashboard": "Bảng Điều Khiển",
    "settings": "Cài Đặt",
    "logout": "Đăng Xuất",
    "language": "Ngôn Ngữ"
  },
  "auth": {
    "login": "Đăng Nhập",
    "username": "Tên Đăng Nhập",
    "password": "Mật Khẩu",
    "welcome": "Chào mừng {{name}}!"
  },
  "errors": {
    "404": "Không Tìm Thấy Trang",
    "500": "Lỗi Máy Chủ",
    "networkError": "Lỗi Kết Nối"
  }
}
```

**src/assets/i18n/en.json**
```json
{
  "common": {
    "home": "Home",
    "dashboard": "Dashboard",
    "settings": "Settings",
    "logout": "Logout",
    "language": "Language"
  },
  "auth": {
    "login": "Login",
    "username": "Username",
    "password": "Password",
    "welcome": "Welcome {{name}}!"
  },
  "errors": {
    "404": "Page Not Found",
    "500": "Server Error",
    "networkError": "Network Error"
  }
}
```

---

## Sử Dụng trong Components

### Cách 1: Sử Dụng Pipe `translate`

#### Template (HTML)
```html
<!-- Cách 1: Dùng key trực tiếp -->
<h1>{{ 'common.home' | translate }}</h1>

<!-- Cách 2: Dùng biến interpolation -->
<p>{{ 'auth.welcome' | translate: { name: userName } }}</p>

<!-- Cách 3: Dùng ngIf với async -->
<ion-button 
  *ngIf="(isLoggedIn$ | async) as isLoggedIn"
  [disabled]="!isLoggedIn">
  {{ 'common.logout' | translate }}
</ion-button>
```

### Cách 2: Sử Dụng Service (TypeScript)

#### Component TypeScript
```typescript
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  welcomeMessage: string = '';
  currentLanguage: string = 'vi';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.translate.onLangChange$.subscribe((event) => {
      this.currentLanguage = event.lang;
      this.loadWelcomeMessage();
    });

    this.loadWelcomeMessage();
  }

  loadWelcomeMessage() {
    this.translate
      .get('auth.welcome', { name: 'Hùng' })
      .subscribe((res: string) => {
        this.welcomeMessage = res;
      });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
```

#### Component HTML
```html
<ion-content>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ welcomeMessage }}</ion-card-title>
    </ion-card-header>
  </ion-card>

  <ion-button (click)="changeLanguage('vi')">
    Tiếng Việt
  </ion-button>
  <ion-button (click)="changeLanguage('en')">
    English
  </ion-button>

  <p>{{ 'common.currentLanguage' | translate }}: {{ currentLanguage }}</p>
</ion-content>
```

---

## Thay Đổi Ngôn Ngữ Động

### Service Quản Lý Ngôn Ngữ

Tạo file `src/app/services/language.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('vi');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private supportedLanguages = ['vi', 'en', 'fr'];

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage() {
    // Lấy ngôn ngữ từ localStorage hoặc browser
    const savedLang = localStorage.getItem('app-language') || 'vi';
    this.setLanguage(savedLang);
  }

  setLanguage(lang: string) {
    if (this.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('app-language', lang);
      this.currentLanguageSubject.next(lang);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  getAvailableLanguages(): string[] {
    return this.supportedLanguages;
  }

  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get(key: string, params?: any): Observable<any> {
    return this.translate.get(key, params);
  }
}
```

### Sử Dụng Language Service

```typescript
import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-selector',
  template: `
    <div class="language-selector">
      <ion-select 
        [value]="currentLanguage$ | async"
        (ionChange)="changeLanguage($event)">
        <ion-select-option value="vi">Tiếng Việt</ion-select-option>
        <ion-select-option value="en">English</ion-select-option>
        <ion-select-option value="fr">Français</ion-select-option>
      </ion-select>
    </div>
  `,
})
export class LanguageSelectorComponent {
  currentLanguage$!: Observable<string>;

  constructor(private languageService: LanguageService) {
    this.currentLanguage$ = this.languageService.currentLanguage$;
  }

  changeLanguage(event: any) {
    this.languageService.setLanguage(event.detail.value);
  }
}
```

---

## Best Practices cho Ionic

### 1. **Lazy Load Translation Files**

```typescript
// Chỉ tải file ngôn ngữ khi cần thiết
constructor(private translate: TranslateService) {
  this.translate.setDefaultLanguage('vi');
  this.translate.use(this.getSavedLanguage());
}
```

### 2. **Persist Language Selection**

```typescript
// Lưu ngôn ngữ trong Storage để giữ preference
import { Storage } from '@ionic/storage-angular';

export class LanguageService {
  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) {
    this.initLanguageFromStorage();
  }

  private async initLanguageFromStorage() {
    const savedLang = await this.storage.get('app-lang') || 'vi';
    this.translate.use(savedLang);
  }

  async setLanguage(lang: string) {
    await this.storage.set('app-lang', lang);
    this.translate.use(lang);
  }
}
```

### 3. **Handle Missing Translations**

```typescript
// src/app/app.module.ts hoặc main.ts
TranslateModule.forRoot({
  defaultLanguage: 'vi',
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useFactory: missingTranslationHandler,
  },
})

// Handler function
export function missingTranslationHandler() {
  return {
    handle: (params: MissingTranslationHandlerParams) => {
      console.warn(`Missing translation: ${params.key}`);
      return params.key; // Hiển thị key nếu translation không tìm được
    },
  };
}
```

### 4. **Organization Structure cho Translations**

```json
// en.json - Structured approach
{
  "header": {
    "title": "Application",
    "nav": {
      "home": "Home",
      "about": "About",
      "contact": "Contact"
    }
  },
  "pages": {
    "home": {
      "title": "Welcome",
      "description": "Welcome to our app"
    }
  },
  "common": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete"
    },
    "messages": {
      "success": "Success!",
      "error": "An error occurred",
      "loading": "Loading..."
    }
  }
}
```

### 5. **Use Translation Keys Constants**

```typescript
// src/app/constants/i18n.constants.ts
export const I18N_KEYS = {
  COMMON: {
    HOME: 'common.home',
    DASHBOARD: 'common.dashboard',
    LOGOUT: 'common.logout',
  },
  AUTH: {
    LOGIN: 'auth.login',
    WELCOME: 'auth.welcome',
  },
  ERRORS: {
    NOT_FOUND: 'errors.404',
    SERVER_ERROR: 'errors.500',
  },
} as const;

// Sử dụng trong component
{{ I18N_KEYS.AUTH.LOGIN | translate }}
```

### 6. **Performance: Use OnPush Change Detection**

```typescript
@Component({
  selector: 'app-my-component',
  template: '{{ "common.home" | translate }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  // Component sẽ chỉ re-render khi cần thiết
}
```

---

## Troubleshooting

### Issue 1: Translation File Not Loading

**Problem:** `GET ./assets/i18n/vi.json 404`

**Solution:**
- Kiểm tra đường dẫn file có chính xác?
- Trong `angular.json`, kiểm tra `"assets"` có bao gồm `src/assets`?

```json
// angular.json
"assets": [
  "src/favicon.ico",
  "src/assets"
]
```

### Issue 2: Translations Not Working in Dynamic Content

**Problem:** Translation pipe không hoạt động với content tạo động

**Solution:** Dùng `TranslateService.get()` hoặc `instant()`:

```typescript
// ❌ Sai
const message = `{{ 'auth.welcome' | translate }}`;

// ✅ Đúng
this.translate.get('auth.welcome').subscribe(msg => {
  this.message = msg;
});
```

### Issue 3: Memory Leak với Translations

**Problem:** Component subscribe đến translation không unsubscribe

**Solution:** Dùng `takeUntilDestroyed()` hoặc `OnDestroy`:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private translate: TranslateService) {
    this.translate.onLangChange$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.refresh();
      });
  }
}
```

### Issue 4: Ngôn Ngữ Reset Sau Reload

**Solution:** Lưu preference vào `localStorage` hoặc `Ionic Storage`:

```typescript
ngOnInit() {
  const savedLang = localStorage.getItem('app-language') || 'vi';
  this.translate.use(savedLang);
}

changeLanguage(lang: string) {
  this.translate.use(lang);
  localStorage.setItem('app-language', lang);
}
```

---

## Ví Dụ Hoàn Chỉnh: Settings Page cho Ionic

```typescript
// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  languages: { code: string; name: string }[] = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' },
  ];

  currentLanguage: string = 'vi';

  constructor(
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.languageService.getCurrentLanguage();
  }

  onLanguageChange(lang: string) {
    this.languageService.setLanguage(lang);
    this.currentLanguage = lang;
  }
}
```

```html
<!-- settings.component.html -->
<ion-content>
  <ion-list>
    <ion-list-header>
      <ion-label>{{ 'common.language' | translate }}</ion-label>
    </ion-list-header>

    <ion-radio-group 
      [value]="currentLanguage"
      (ionChange)="onLanguageChange($event.detail.value)">
      <ion-item *ngFor="let lang of languages">
        <ion-label>{{ lang.name }}</ion-label>
        <ion-radio 
          slot="start" 
          [value]="lang.code"
          [checked]="currentLanguage === lang.code">
        </ion-radio>
      </ion-item>
    </ion-radio-group>
  </ion-list>
</ion-content>
```

---

## Tài Liệu Tham Khảo

- [ngx-translate Official Docs](https://github.com/ngx-translate/core)
- [Ionic Internationalization Guide](https://ionicframework.com/docs/native/globalization)
- [Angular i18n Guide](https://angular.io/guide/i18n)

---

**Tác Giả:** Development Team  
**Cập Nhật:** March 2026  
**Phiên Bản:** 1.0
