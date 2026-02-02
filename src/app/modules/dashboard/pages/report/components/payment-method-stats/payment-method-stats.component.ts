import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ChartData } from "chart.js";
import { ReportService } from "../../services/report.service";
import { ChartStatsRequest } from "../../models/report.model";

interface PaymentMethodStat {
  method: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: "app-payment-method-stats",
  templateUrl: "./payment-method-stats.component.html",
  styleUrls: ["./payment-method-stats.component.scss"],
  standalone: false,
})
export class PaymentMethodStatsComponent implements OnChanges, OnInit {
  @Input() dateRangeType: "day" | "this-week" | "this-month" | "week" | "month" | "custom" = "day";
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Input() comparisonStartDate?: Date;
  @Input() comparisonEndDate?: Date;
  @Input() comparisonMode: boolean = false;

  isLoading = false;
  chartData: ChartData<"doughnut"> = {
    labels: [],
    datasets: [],
  };

  paymentMethods: PaymentMethodStat[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["dateRangeType"] ||
      changes["startDate"] ||
      changes["endDate"] ||
      changes["comparisonMode"] ||
      changes["comparisonStartDate"] ||
      changes["comparisonEndDate"]
    ) {
      this.loadChartData();
    }
  }

  private loadChartData(): void {
    this.paymentMethods = [];
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;

    const request: ChartStatsRequest = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      comparisonStartDate: this.comparisonStartDate ? this.comparisonStartDate.toISOString() : undefined,
      comparisonEndDate: this.comparisonEndDate ? this.comparisonEndDate.toISOString() : undefined,
      comparisonMode: this.comparisonMode,
    };

    this.reportService.getPaymentMethodStats(request).subscribe({
      next: (response) => {
        this.paymentMethods = response.data || [];

        // Generate colors if not provided
        const defaultColors = [
          '#3b82f6', // blue
          '#10b981', // green
          '#f59e0b', // amber
          '#ef4444', // red
          '#8b5cf6', // violet
          '#ec4899', // pink
          '#06b6d4', // cyan
          '#f97316', // orange
        ];

        this.paymentMethods = this.paymentMethods.map((method, index) => ({
          ...method,
          color: method.color || defaultColors[index % defaultColors.length]
        }));

        this.chartData = {
          labels: this.paymentMethods.map((m) => m.method),
          datasets: [
            {
              data: this.paymentMethods.map((m) => m.count),
              backgroundColor: this.paymentMethods.map((m) => m.color),
            },
          ],
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading payment method stats:", error);
        this.isLoading = false;
      },
    });
  }
}
