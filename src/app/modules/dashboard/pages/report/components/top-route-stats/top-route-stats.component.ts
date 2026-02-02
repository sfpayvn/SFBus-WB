import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { TopRoutesQuery, TopRoutesResponse } from "../../models/report.model";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "app-top-route-stats",
  templateUrl: "./top-route-stats.component.html",
  styleUrls: ["./top-route-stats.component.scss"],
  standalone: false,
})
export class TopRouteStatsComponent implements OnInit, OnChanges {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Input() comparisonMode: boolean = false;
  @Input() comparisonStartDate?: Date;
  @Input() comparisonEndDate?: Date;

  isLoading = false;

  displayRoutes: TopRoutesResponse = {
    data: [],
    total: 0,
    totalRevenue: 0,
    metadata: {
      startDate: "",
      endDate: "",
    },
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Don't load here - wait for inputs to be set
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startDate"] || changes["endDate"]) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;

    const request: TopRoutesQuery = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
    };

    this.reportService.getTopRoutesReport(request).subscribe({
      next: (response) => {
        this.displayRoutes = response;
        console.log("🚀 ~ TopRouteStatsComponent ~ loadData ~ this.displayRoutes:", this.displayRoutes);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading booking chart stats:", error);
        // Fallback to mock data on error
        this.isLoading = false;
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(value)
      .replace("₫", "đ");
  }
}
