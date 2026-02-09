import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZModule } from '@rsApp/library-modules/nz-module';
import { AppTableColumnComponent } from './app-table-column.component';
import { ManagementSharedModule } from '@rsApp/modules/management/management-share.module';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  standalone: true,
  imports: [CommonModule, NZModule, ManagementSharedModule],
})
export class AppTableComponent implements AfterViewInit, OnChanges, AfterContentInit {
  @Input() rows: any[] = [];
  @Input() isLoaded = false;
  @Input() showSelection: boolean = true;
  // selection support
  @Input() selectedIds: string[] = [];
  @Input() rowIdKey: string = '_id';
  @Output() selectionChange = new EventEmitter<string[]>();
  // columns: array of { key: string, label: string, widthPx?: number, sticky?: 'left'|'right', formatter?: (row) => any }
  @Input() columns: Array<any> = [];
  // Optional external filter/sort functions provided by parent component.
  // externalFilterFn(filterValue, record, column) => boolean
  @Input() externalFilterFn?: (filterValue: any, record: any, column?: any) => boolean;
  // externalSortFn(a, b, column) => number
  @Input() externalSortFn?: (a: any, b: any, column?: any) => number;
  @Output() currentPageDataChange = new EventEmitter<any[]>();
  // table action toolbar
  @Input() tableActionTitle: string = '';
  @Output() searchDataEvent = new EventEmitter<any>();
  @Output() sortDataEvent = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  // pagination inputs (optional) - if provided, component will render footer
  @Input() pageIdx: number = 1;
  @Input() pageSize: number = 10;
  @Input() totalItem: number = 0;
  @Input() totalPage: number = 0;
  @Input() showFooter: boolean = false;
  @Input() showHeader: boolean = false;
  @Output() reloadDataAndPageEvent = new EventEmitter<any>();

  @ViewChild('dataTableWrapper') dataTableWrapper!: ElementRef<HTMLDivElement>;
  @ContentChildren(AppTableColumnComponent) projectedColumns!: QueryList<AppTableColumnComponent>;

  // total computed min-width for the inner table (px)
  totalTableWidth: number = 0;

  private isDragging = false;
  private dragStartX = 0;
  private dragStartScroll = 0;
  private pointerDown = false;
  private dragThreshold = 6; // pixels
  private activePointerId: number | null = null;
  private dragListeners: Array<() => void> = [];

  selectedSet = new Set<string>();

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.computeStickyOffsets();
      this.initDragScroll();
      this.updateDividers();
    }, 0);
  }

  ngAfterContentInit(): void {
    if (this.projectedColumns && this.projectedColumns.length > 0) {
      this.columns = this.projectedColumns.toArray().map((c) => ({
        key: c.key,
        label: c.label,
        widthPx: c.widthPx,
        sticky: c.sticky,
        template: c.template,
      }));
      setTimeout(() => {
        this.computeStickyOffsets();
        this.updateTotalTableWidth();
        this.updateDividers();
      }, 0);
    }
    // initialize selected set
    try {
      this.selectedSet = new Set(this.selectedIds || []);
    } catch (e) {
      this.selectedSet = new Set<string>();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rows'] || changes['columns']) {
      setTimeout(() => {
        this.computeStickyOffsets();
        this.updateDividers();
      }, 0);
    }
    if (changes['selectedIds'] && changes['selectedIds'].currentValue) {
      this.selectedSet = new Set(changes['selectedIds'].currentValue || []);
    }
  }

  computeStickyOffsets() {
    try {
      // compute left offsets for left-sticky columns by summing widths
      // if selection column is shown reserve its width
      let leftAcc = this.showSelection ? 32 : 0;
      for (const col of this.columns) {
        if (col.sticky === 'left') {
          col._left = leftAcc;
          leftAcc += Number(col.widthPx || 40);
        } else {
          col._left = undefined;
        }
      }

      // compute right offsets for right-sticky columns by summing from end
      let rightAcc = 0;
      for (let i = this.columns.length - 1; i >= 0; i--) {
        const col = this.columns[i];
        if (col.sticky === 'right') {
          col._right = rightAcc;
          rightAcc += Number(col.widthPx || 70);
        } else {
          col._right = undefined;
        }
      }
      // also update total width
      this.updateTotalTableWidth();
    } catch (e) {
      // ignore
    }
  }

  updateTotalTableWidth() {
    try {
      let total = 0;
      for (const col of this.columns) {
        total += Number(col.widthPx || 120);
      }
      // include selection column width if shown
      if (this.showSelection) total += 32;
      this.totalTableWidth = total;
    } catch (e) {
      this.totalTableWidth = 0;
    }
  }

  onCurrentPageDataChange(data: any) {
    this.currentPageDataChange.emit(data);
    setTimeout(() => this.updateDividers(), 0);
  }

  // Return a filter function for nz-table header: prefer column-level, else use externalFilterFn
  getFilterFn(col: any): ((filterValue: any, record: any) => boolean) | null {
    if (col && col.filterFn) return col.filterFn;
    if (this.externalFilterFn)
      return (filterValue: any, record: any) => this.externalFilterFn!(filterValue, record, col);
    return null;
  }

  // Return a sort function for nz-table header: prefer column-level, else use externalSortFn
  getSortFn(col: any): ((a: any, b: any) => number) | null {
    if (col && col.sortFn) return col.sortFn;
    if (this.externalSortFn) return (a: any, b: any) => this.externalSortFn!(a, b, col);
    return null;
  }

  // selection helpers
  headerChecked(): boolean {
    if (!this.rows || this.rows.length === 0) return false;
    return this.rows.every((r) => this.selectedSet.has((r as any)[this.rowIdKey]));
  }

  headerIndeterminate(): boolean {
    if (!this.rows || this.rows.length === 0) return false;
    const some = this.rows.some((r) => this.selectedSet.has((r as any)[this.rowIdKey]));
    return some && !this.headerChecked();
  }

  toggleSelectAll(checked: boolean) {
    if (checked) {
      this.rows.forEach((r) => this.selectedSet.add((r as any)[this.rowIdKey]));
    } else {
      this.rows.forEach((r) => this.selectedSet.delete((r as any)[this.rowIdKey]));
    }
    this.emitSelection();
  }

  toggleRowSelection(row: any, checked: boolean) {
    const id = row[this.rowIdKey];
    if (checked) this.selectedSet.add(id);
    else this.selectedSet.delete(id);
    this.emitSelection();
  }

  emitSelection() {
    this.selectionChange.emit(Array.from(this.selectedSet));
  }

  // default action handlers (used when actions column has no projected template)
  editRow(row: any) {
    this.edit.emit(row);
  }

  deleteRow(id: string) {
    this.delete.emit(id);
  }

  updateDividers() {
    try {
      const el = this.dataTableWrapper?.nativeElement;
      if (!el) return;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 1;
      const atEnd = Math.abs(el.scrollLeft - maxScrollLeft) <= 1;

      const actionsCells = Array.from(el.querySelectorAll('.actions-cell')) as HTMLElement[];
      const leftCells = Array.from(el.querySelectorAll('.left-divider-cell')) as HTMLElement[];

      actionsCells.forEach((cell) => {
        if (!atEnd) this.renderer.addClass(cell, 'show-divider');
        else this.renderer.removeClass(cell, 'show-divider');
      });
      leftCells.forEach((cell) => {
        if (!atStart) this.renderer.addClass(cell, 'show-divider');
        else this.renderer.removeClass(cell, 'show-divider');
      });
    } catch (e) {}
  }

  onScroll() {
    this.updateDividers();
  }

  initDragScroll() {
    try {
      const el = this.dataTableWrapper?.nativeElement;
      if (!el) return;
      const offDown = this.renderer.listen(el, 'pointerdown', (ev: PointerEvent) => {
        if (ev.isPrimary === false) return;
        this.pointerDown = true;
        this.activePointerId = ev.pointerId;
        this.dragStartX = ev.pageX;
        this.dragStartScroll = el.scrollLeft;
      });
      const offMove = this.renderer.listen(el, 'pointermove', (ev: PointerEvent) => {
        if (!this.pointerDown) return;
        const dx = ev.pageX - this.dragStartX;
        if (!this.isDragging && Math.abs(dx) > this.dragThreshold) {
          this.isDragging = true;
          try {
            el.setPointerCapture?.(ev.pointerId);
          } catch {}
          this.renderer.addClass(el, 'dragging');
        }
        if (this.isDragging) {
          ev.preventDefault();
          const walk = dx;
          el.scrollLeft = this.dragStartScroll - walk;
          this.updateDividers();
        }
      });
      const offUp = this.renderer.listen(el, 'pointerup', (ev: PointerEvent) => {
        if (this.isDragging) {
          try {
            el.releasePointerCapture?.(ev.pointerId);
          } catch {}
        }
        this.isDragging = false;
        this.pointerDown = false;
        this.activePointerId = null;
        this.renderer.removeClass(el, 'dragging');
      });
      const offCancel = this.renderer.listen(el, 'pointercancel', () => {
        this.isDragging = false;
        this.pointerDown = false;
        this.activePointerId = null;
        this.renderer.removeClass(el, 'dragging');
      });
      const offLeave = this.renderer.listen(el, 'pointerleave', () => {
        if (this.isDragging || this.pointerDown) {
          this.isDragging = false;
          this.pointerDown = false;
          this.activePointerId = null;
          this.renderer.removeClass(el, 'dragging');
        }
      });
      // keep listeners to release later if needed
      this.dragListeners = [offDown, offMove, offUp, offCancel, offLeave];
    } catch (err) {}
  }
}
