// cap-check.directive.ts
import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CapsService } from '../services/caps.service';
import { toast } from 'ngx-sonner';

type CapMode = 'block' | 'disable';

@Directive({
  selector: 'button[capCheck], a[capCheck]',
  standalone: true,
})
export class CapCheckDirective implements OnInit, OnDestroy {
  private caps = inject(CapsService);
  private el = inject(ElementRef<HTMLElement>);
  private r2 = inject(Renderer2);
  private sub?: Subscription;
  private removeCapture?: () => void;

  @Input('capModule') moduleKey!: string;
  @Input('capFunction') functionKey: string | null = null;

  /** Chỉ chặn click hay disable thật */
  @Input() capMode: CapMode = 'block';
  /** Ẩn hẳn khi không có quyền */
  @Input() capHideOnDenied = false;
  /** Dùng capture để chặn click từ sớm khi capMode='block' */
  @Input() capUseCapture = true;

  /** Trigger re-check tuỳ ý (optional) */
  @Input() capRefresh$?: Observable<any>;

  /** Xuất trạng thái cho bên ngoài */
  @Output() capDisabledChange = new EventEmitter<boolean>();
  @Output() capVisibleChange = new EventEmitter<boolean>();

  /** Quyền hiện tại: true = KHÔNG được phép (bị chặn) */
  private disallowed = false;

  ngOnInit() {
    const stream =
      this.capRefresh$ ??
      (this.caps as any).caps$ ??
      (this.caps as any).items$ ??
      (this.caps as any).subject?.asObservable?.() ??
      of(null);

    this.sub = stream
      .pipe(
        startWith(null),
        map(() => this.computeDisallowed()),
      )
      .subscribe((disable: boolean) => {
        this.disallowed = disable;
        this.applyPresentation(); // hiển thị/disable theo mode
      });

    // chặn sớm ở capture khi ở mode 'block'
    if (this.capMode === 'block' && this.capUseCapture) {
      const native = this.el.nativeElement;
      const captureHandler = (ev: Event) => {
        if (!this.disallowed) return;
        this.blockClick(ev);
        return false;
      };
      native.addEventListener('click', captureHandler, { capture: true });
      this.removeCapture = () => native.removeEventListener('click', captureHandler, { capture: true } as any);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.removeCapture?.();
  }

  private computeDisallowed(): boolean {
    if (!this.moduleKey) return false;
    return !!this.caps.disabled(this.moduleKey, this.functionKey);
  }

  private applyPresentation() {
    const el = this.el.nativeElement;

    // 1) Visible
    const visible = !(this.capHideOnDenied && this.disallowed);
    this.r2.setStyle(el, 'display', visible ? null : 'none');
    this.capVisibleChange.emit(!!visible);

    // 2) Disabled/block theo mode
    if (this.capMode === 'disable' && el.tagName === 'BUTTON') {
      // disable thật
      this.r2.setProperty(el as HTMLButtonElement, 'disabled', this.disallowed);
      this.capDisabledChange.emit(this.disallowed);
    } else {
      // không disable, chỉ chặn click -> disabledChange = disallowed (để bạn biết đang bị chặn)
      this.capDisabledChange.emit(this.disallowed);
    }
  }

  // Chặn chuột & bàn phím khi đang bị chặn (mode 'block')
  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    if (this.capMode !== 'block' || !this.disallowed) return;
    this.blockClick(ev);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(ev: Event) {
    if (this.capMode !== 'block' || !this.disallowed) return;
    if ((ev as KeyboardEvent).key === 'Enter' || (ev as KeyboardEvent).key === ' ') {
      this.blockClick(ev);
    }
  }

  blockClick(ev: Event) {
    toast.error(
      `Hành động '${this.functionKey ?? 'không xác định'}' '${this.moduleKey}' không được phép hoặc hết lượt.`,
    );
    ev.preventDefault();
    ev.stopPropagation();
    (ev as any).stopImmediatePropagation?.();
    (ev as any).returnValue = false;
  }
}
