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

  constructor(private translate: TranslateService, private http: HttpClient) {
    // initialization deferred to initLanguage()
  }

  public initLanguage(): Promise<void> {
    if (this.initialized) return Promise.resolve();

    this.translate.setDefaultLang('vi');
    const savedLang = (localStorage.getItem('app-language') as string) || 'vi';
    console.log("🚀 ~ LanguageService ~ initLanguage ~ savedLang:", savedLang)

    const translationRequests = this.supportedLanguages.map((lang) => this.loadTranslationFile(lang));

    return forkJoin(translationRequests)
      .toPromise()
      .then(() => {
        this.setLanguage(savedLang);
        this.initialized = true;
        console.log('✓ All translations loaded successfully');
      })
      .catch((error) => {
        console.error('✗ Error loading translations:', error);
        this.translate.use('vi');
        this.initialized = true;
      });
  }

  private loadTranslationFile(lang: string): Observable<any> {
    const translationFile = `./assets/i18n/${lang}.json`;
    return this.http.get<any>(translationFile).pipe(
      map((translations) => {
        this.translate.setTranslation(lang, translations, true);
        return translations;
      }),
      catchError((error) => {
        console.error(`✗ Error loading ${lang} translations:`, error);
        this.translate.setTranslation(lang, {}, true);
        return of({});
      }),
    );
  }

  public setLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('app-language', lang);
      this.currentLanguageSubject.next(lang);
      console.log(`✓ Language switched to: ${lang}`);
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  public getAvailableLanguages(): string[] {
    return this.supportedLanguages;
  }

  public instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  public get(key: string | string[], params?: any): Observable<any> {
    return this.translate.get(key, params);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getTranslationOrDefault(key: string, defaultValue: string): Observable<any> {
    return this.translate.get(key);
  }
}
