import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from "@angular/core";

@Directive({
  // allow usage as element <drag-scroll> or attribute [drag-scroll]
  selector: "drag-scroll, [drag-scroll]",
  standalone: true,
})
export class DragScrollDirective implements OnInit, OnDestroy {
  private el: HTMLElement;
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private pointerMove = this.onPointerMove.bind(this);
  private pointerUp = this.onPointerUp.bind(this);
  private pointerDown = this.onPointerDown.bind(this);
  private clickBlocker = (e: Event) => this.onClickCaptured(e as MouseEvent);
  private dragging = false;
  private lastDragTime = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.el = this.elementRef.nativeElement as HTMLElement;
  }

  ngOnInit(): void {
    // ensure overflow-x for web
    const style = getComputedStyle(this.el);
    if (style.overflowX === "" || style.overflowX === "visible") {
      this.renderer.setStyle(this.el, "overflow-x", "auto");
    }
    
    // Set white-space to nowrap so children don't wrap to next line
    if (!style.whiteSpace || style.whiteSpace === "normal") {
      this.renderer.setStyle(this.el, "white-space", "nowrap");
    }
    
    // Set cursor to indicate draggable
    this.renderer.setStyle(this.el, "cursor", "grab");
    
    // enable pointer events
    this.el.style.touchAction = this.el.style.touchAction || "pan-y"; // allow vertical pan by default

    // Use bound method so we can remove it properly
    this.el.addEventListener("pointerdown", this.pointerDown);
    // capture click at capture phase to suppress clicks immediately after a drag
    document.addEventListener("click", this.clickBlocker, true);
    // attach move/up on document to reliably capture events
    document.addEventListener("pointermove", this.pointerMove);
    document.addEventListener("pointerup", this.pointerUp);
    document.addEventListener("pointercancel", this.pointerUp);
  }

  ngOnDestroy(): void {
    this.el.removeEventListener("pointerdown", this.pointerDown);
    document.removeEventListener("pointermove", this.pointerMove);
    document.removeEventListener("pointerup", this.pointerUp);
    document.removeEventListener("pointercancel", this.pointerUp);
    document.removeEventListener("click", this.clickBlocker, true);
  }

  private onPointerDown(e: PointerEvent) {
    // only left button or touch
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this.isDown = true;
    this.el.classList.add("active-drag");
    this.startX = e.clientX;
    this.scrollLeft = this.el.scrollLeft;
    this.dragging = false;
    // capture pointer to element so we still receive events
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch (err) {
      // ignore
    }
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.clientX;
    const walk = x - this.startX; // pixels moved
    // if moved more than threshold treat as dragging
    if (Math.abs(walk) > 5) {
      this.dragging = true;
    }
    this.el.scrollLeft = this.scrollLeft - walk;
  }

  private onPointerUp() {
    if (!this.isDown) return;
    this.isDown = false;
    this.el.classList.remove("active-drag");
    if (this.dragging) {
      // record drag time to suppress subsequent click
      this.lastDragTime = Date.now();
    }
    this.dragging = false;
  }

  private onClickCaptured(e: MouseEvent) {
    // if a drag just finished, prevent the following click from firing
    if (this.lastDragTime && Date.now() - this.lastDragTime < 400) {
      e.stopImmediatePropagation();
      e.preventDefault();
      // clear lastDragTime so next clicks are allowed
      this.lastDragTime = 0;
      return;
    }
  }
}
