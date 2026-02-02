import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { ChartData } from "chart.js";
import { ChartStatsRequest } from "../../models/report.model";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "app-goods-chart",
  templateUrl: "./goods-chart.component.html",
  styleUrls: ["./goods-chart.component.scss"],
  standalone: false,
})
export class GoodsChartComponent implements OnChanges {
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

  isLoading = false;
  chartData: ChartData<"bar"> = {
    labels: [],
    datasets: [],
  };

  @Output() viewDetailEvent = new EventEmitter<void>();

  constructor(private reportService: ReportService) {}

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
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;

    const request: ChartStatsRequest = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      comparisonMode: this.comparisonMode,
      comparisonStartDate: this.comparisonStartDate ? this.comparisonStartDate.toISOString() : undefined,
      comparisonEndDate: this.comparisonEndDate ? this.comparisonEndDate.toISOString() : undefined,
    };

    this.reportService.getGoodsChartStats(request).subscribe({
      next: (response) => {
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
              label: this.comparisonMode ? "Kỳ hiện tại" : "Số lượng hàng hóa",
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
        // Fallback to mock data on error
        this.isLoading = false;
      },
    });
  }

  viewDetail(): void {
    this.viewDetailEvent.emit();
    // Implement view detail logic here
  }
}
