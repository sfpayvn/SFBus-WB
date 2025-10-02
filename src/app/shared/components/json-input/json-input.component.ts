import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ng-zorro
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'json-input',
  standalone: true,
  template: `
    <div class="relative">
      <textarea
        nz-input
        [rows]="rows"
        [disabled]="disabled"
        [(ngModel)]="raw"
        (ngModelChange)="onInputChange()"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        class="border-slate-700  pr-28 font-mono text-sm text-slate-100"
        spellcheck="false"></textarea>

      <button
        nz-button
        type="button"
        nzType="primary"
        class="!absolute top-2 right-2"
        (click)="format()"
        nz-tooltip
        nzTooltipTitle="Ctrl/⌘ + Enter"
        [disabled]="disabled">
        Format
      </button>
    </div>

    <nz-alert
      *ngIf="errorMsg"
      nzType="error"
      [nzMessage]="'JSON lỗi ✗'"
      [nzDescription]="errorMsg"
      [nzShowIcon]="true"
      class="mt-2"></nz-alert>
  `,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule, NzToolTipModule, NzAlertModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JsonInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonInputComponent implements ControlValueAccessor, Validator {
  /** Options */
  @Input() placeholder = 'Nhập/Dán JSON...';
  @Input() rows = 14;
  @Input() indent = 2; // 0..10
  @Input() sortKeys = true;
  @Input() disabled = false;

  /** State */
  raw = '';
  errorMsg = '';

  /** CVA */
  private onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.raw = value ?? '';
    // không tự format khi writeValue
    this.errorMsg = '';
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Validator: hợp lệ nếu rỗng hoặc parse được */
  validate(_: AbstractControl): ValidationErrors | null {
    if (!this.raw?.trim()) return null;
    try {
      JSON.parse(this.normalize(this.raw));
      return null;
    } catch (e: any) {
      return { jsonInvalid: e?.message || true };
    }
  }

  /** Input change → push raw về form (không auto-format) */
  onInputChange() {
    // nếu rỗng → null; nếu có nội dung → tạm thời trả về raw để form biết có thay đổi
    this.onChange(this.raw?.length ? this.raw : null);
    this.errorMsg = '';
  }

  /** Click Format → format ngay trong input, emit giá trị đã prettify */
  format() {
    const txt = (this.raw || '').trim();
    if (!txt) {
      this.onChange(null);
      this.errorMsg = '';
      return;
    }
    try {
      let data = JSON.parse(this.normalize(txt));
      if (this.sortKeys) data = this.sortDeep(data);
      const i = Math.max(0, Math.min(10, Number(this.indent || 2)));
      this.raw = JSON.stringify(data, null, i);
      this.errorMsg = '';
      this.onChange(this.raw);
      this.onTouched();
    } catch (e: any) {
      this.errorMsg = e?.message || String(e);
      // giữ nguyên raw để user sửa tiếp; báo lỗi cho form
      this.onChange(null);
    }
  }

  /** Keyboard: Ctrl/Cmd + Enter = Format */
  // (gắn host listener ở component cha tuỳ nhu cầu; để đơn giản, bỏ qua ở đây)

  /** Helpers */
  private normalize(t: string): string {
    // sửa lỗi phổ biến: quote cong, dấu phẩy cuối phần tử
    return t.replace(/[\u201C\u201D]/g, '"').replace(/,\s*([}\]])/g, '$1');
  }
  private sortDeep(v: any): any {
    if (Array.isArray(v)) return v.map((x) => this.sortDeep(x));
    if (v && typeof v === 'object' && v.constructor === Object) {
      const out: any = {};
      Object.keys(v)
        .sort((a, b) => a.localeCompare(b))
        .forEach((k) => (out[k] = this.sortDeep(v[k])));
      return out;
    }
    return v;
  }
}
