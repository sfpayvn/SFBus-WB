import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-report-header",
  templateUrl: "./report-header.component.html",
  styleUrls: ["./report-header.component.scss"],
  standalone: false,
})
export class ReportHeaderComponent {
  @Input() filterForm!: FormGroup;
  @Input() dateRangeType: "day" | "this-week" | "this-month" | "week" | "month" | "custom"  = "day";
  @Input() comparisonMode: boolean = false;

  @Output() dateRangeTypeChange = new EventEmitter<"day" | "this-week" | "this-month" | "week" | "month" | "custom">();
  @Output() comparisonModeChange = new EventEmitter<boolean>();
  @Output() exportReport = new EventEmitter<"excel" | "pdf">();
  @Output() reload = new EventEmitter<void>();

  disabledDate = (current: Date): boolean => {
    return current && current.getTime() > Date.now();
  };

  disabledCompareDate = (current: Date): boolean => {
    // Disable future dates
    if (current && current.getTime() > Date.now()) {
      return true;
    }
    return false;
  };

  setDateRangeType(type: "day" | "this-week" | "this-month" | "week" | "month" | "custom"): void {
    this.dateRangeTypeChange.emit(type);
  }

  toggleComparisonMode(): void {
    this.comparisonModeChange.emit(!this.comparisonMode);
  }

  onExport(type: "excel" | "pdf"): void {
    this.exportReport.emit(type);
  }

  onReload(): void {
    this.reload.emit();
  }
}
