import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { ChartData } from "chart.js";
import { ReportService } from "../../services/report.service";
import { ChartStatsRequest, ChartStatsResponse } from "../../models/report.model";
import { Router } from "@angular/router";
import { da } from "date-fns/locale";

@Component({
  selector: "app-booking-chart",
  templateUrl: "./booking-chart.component.html",
  styleUrls: ["./booking-chart.component.scss"],
  standalone: false,
})
export class BookingChartComponent implements OnChanges, OnInit {
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const datasetIndex = context[0].datasetIndex;
            const dataIndex = context[0].dataIndex;
            const dataset = context[0].chart.data.datasets[datasetIndex];

            // Sử dụng originalLabels nếu có, nếu không dùng labels chung
            if (dataset.originalLabels && dataset.originalLabels[dataIndex]) {
              return dataset.originalLabels[dataIndex];
            }
            return context[0].chart.data.labels[dataIndex];
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  @Input() dateRangeType: "day" | "this-week" | "this-month" | "week" | "month" | "custom" = "day";
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Input() comparisonMode: boolean = false;
  @Input() comparisonStartDate?: Date;
  @Input() comparisonEndDate?: Date;
  @Input() isViewDetail?: boolean = true;

  isLoading = false;
  chartData: ChartData<"bar"> = {
    labels: [],
    datasets: [],
  };
  private loadChartDataTimeout: any;
  // remember last loaded range to avoid duplicate requests
  private lastLoadedStart?: string;
  private lastLoadedEnd?: string;

  constructor(private reportService: ReportService, private router: Router) {}

  @Output() viewDetailEvent = new EventEmitter<void>();
  @Output() ondDataLoaded = new EventEmitter<ChartStatsResponse>();

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger load when both start and end are defined and at least one relevant value changed.
    const start = this.startDate ? this.startDate.toISOString() : undefined;
    const end = this.endDate ? this.endDate.toISOString() : undefined;

    const changedRelevant =
      changes["dateRangeType"] ||
      changes["comparisonMode"] ||
      changes["comparisonStartDate"] ||
      changes["comparisonEndDate"] ||
      changes["startDate"] ||
      changes["endDate"];

    const rangeChanged = start !== this.lastLoadedStart || end !== this.lastLoadedEnd;

    if (start && end && changedRelevant && rangeChanged) {
      if (this.loadChartDataTimeout) {
        clearTimeout(this.loadChartDataTimeout);
      }

      this.loadChartDataTimeout = setTimeout(() => {
        this.loadChartData();
        this.lastLoadedStart = start;
        this.lastLoadedEnd = end;
      }, 100);
    }
  }

  private loadChartData(): void {
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;

    const request: ChartStatsRequest = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      comparisonMode: this.comparisonMode,
      comparisonStartDate: this.comparisonStartDate ? this.comparisonStartDate.toISOString() : undefined,
      comparisonEndDate: this.comparisonEndDate ? this.comparisonEndDate.toISOString() : undefined,
    };

    this.reportService.getBookingChartStats(request).subscribe({
      next: (response: ChartStatsResponse) => {
        this.ondDataLoaded.emit(response);

        const currentLabels = response.current?.labels || [];
        const currentData = response.current?.data || [];
        const previousLabels = response.previous?.labels || [];
        const previousData = response.previous?.data || [];

        // Merge labels to show both periods: "8/12 vs 7/12", "9/12 vs 8/12", etc.
        const mergedLabels =
          this.comparisonMode && previousLabels.length > 0
            ? currentLabels.map((label, index) => {
                const prevLabel = previousLabels[index] || "";
                return prevLabel ? `${label} - ${prevLabel}` : label;
              })
            : currentLabels;

        this.chartData = {
          labels: response.metadata?.groupBy == "hour" ? currentLabels : mergedLabels,
          datasets: [
            {
              label: this.comparisonMode ? "Kỳ hiện tại" : "Vé đã bán",
              data: currentData,
              borderColor: "#10b981",
              backgroundColor: "#3b82f6",
              // Store original labels for tooltip
              ...(this.comparisonMode && ({ originalLabels: currentLabels } as any)),
            },
            ...(this.comparisonMode && response.previous
              ? [
                  {
                    label: "Kỳ so sánh",
                    data: previousData,
                    borderColor: "#94a3b8",
                    backgroundColor: "#94a3b8",
                    borderDash: [5, 5],
                    // Store comparison labels for tooltip
                    originalLabels: previousLabels,
                  } as any,
                ]
              : []),
          ],
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading booking chart stats:", error);
        this.isLoading = false;
      },
    });
  }

  viewDetail(): void {
    this.viewDetailEvent.emit();
  }
}
