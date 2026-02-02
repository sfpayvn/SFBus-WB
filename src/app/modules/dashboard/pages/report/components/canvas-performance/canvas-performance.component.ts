import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { ChartData } from "chart.js";

export interface PerformanceItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

@Component({
  selector: "app-canvas-performance",
  templateUrl: "./canvas-performance.component.html",
  styleUrls: ["./canvas-performance.component.scss"],
  standalone: false,
})
export class CanvasPerformanceComponent implements OnChanges, OnDestroy {
  @Input() isLoading = false;
  @Input() loadingTip = "Đang tải dữ liệu...";
  @Input() chartData!: ChartData<"doughnut">;
  @Input() chartType: "doughnut" | "pie" = "doughnut";

  displayChartData!: ChartData<"doughnut">;
  displayItems: PerformanceItem[] = [];
  chartRotation: number = 0;

  get items(): PerformanceItem[] {
    if (!this.chartData?.labels || !this.chartData?.datasets?.[0]) {
      return [];
    }

    const dataset = this.chartData.datasets[0];
    const labels = this.chartData.labels as string[];
    const data = dataset.data as number[];
    const backgroundColor = dataset.backgroundColor as string[];

    const total = data.reduce((sum, val) => sum + Number(val), 0);

    return labels.map((label, i) => ({
      label: label,
      count: Number(data[i]) || 0,
      percentage: total > 0 ? Math.round((Number(data[i]) / total) * 100) : 0,
      color: Array.isArray(backgroundColor) ? backgroundColor[i] : backgroundColor || "#ccc",
    }));
  }

  private loadingInterval?: any;
  private readonly mockColors = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569"];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isLoading"]) {
      if (this.isLoading) {
        this.startLoadingAnimation();
      } else {
        this.stopLoadingAnimation();
        this.transitionToRealData();
      }
    }

    if (changes["chartData"] && !this.isLoading) {
      this.transitionToRealData();
    }
  }

  ngOnDestroy(): void {
    this.stopLoadingAnimation();
  }

  private startLoadingAnimation(): void {
    const itemCount = 4;

    // Generate fixed mock values for smooth animation
    const fixedValues = Array.from({ length: itemCount }, (_, i) => {
      // Create evenly distributed values (25%, 25%, 25%, 25% for 4 items)
      return 100 / itemCount;
    });

    // Generate mock items with fixed values
    this.displayItems = Array.from({ length: itemCount }, (_, i) => ({
      label: `Item ${i + 1}`,
      count: Math.round(fixedValues[i]),
      percentage: Math.round(100 / itemCount),
      color: this.mockColors[i % this.mockColors.length],
    }));

    // Initialize mock chart data with fixed values
    let currentData = fixedValues.map(() => 100 / itemCount);

    this.displayChartData = {
      labels: this.displayItems.map((item) => item.label),
      datasets: [
        {
          data: [...currentData],
          backgroundColor: this.displayItems.map((item) => item.color),
        },
      ],
    };

    // Animate with subtle pulse effect and rotation
    let animationStep = 0;
    this.loadingInterval = setInterval(() => {
      animationStep += 0.1;

      // Rotate the chart
      this.chartRotation += 1; // Rotate 1 degree per frame

      // Create gentle wave effect across segments
      const updatedData = currentData.map((baseValue, i) => {
        // Add subtle sine wave for smooth pulsing
        const pulseOffset = Math.sin(animationStep + i * 0.5) * 2; // ±2% variation
        return Math.max(5, baseValue + pulseOffset); // Ensure minimum value
      });

      // Normalize to keep total sum consistent
      const total = updatedData.reduce((sum, val) => sum + val, 0);
      const normalizedData = updatedData.map((val) => (val / total) * 100);

      // Update display items with normalized data
      normalizedData.forEach((val, i) => {
        this.displayItems[i].count = Math.round(val);
        this.displayItems[i].percentage = Math.round(val);
      });

      // Update chart data
      if (this.displayChartData?.datasets?.[0]) {
        this.displayChartData.datasets[0].data = normalizedData;
        this.displayChartData = { ...this.displayChartData };
      }
    }, 80); // Slower interval for smoother animation
  }

  private stopLoadingAnimation(): void {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = undefined;
    }
  }

  private transitionToRealData(): void {
    this.stopLoadingAnimation();

    if (!this.displayChartData?.datasets || !this.chartData?.datasets) {
      this.displayChartData = this.chartData;
      this.displayItems = this.items;
      return;
    }

    // Update each dataset's data and colors smoothly
    for (let i = 0; i < this.chartData.datasets.length; i++) {
      if (this.displayChartData.datasets[i] && this.chartData.datasets[i]) {
        this.displayChartData.datasets[i].data = this.chartData.datasets[i].data;
        this.displayChartData.datasets[i].backgroundColor = this.chartData.datasets[i].backgroundColor;
        this.displayChartData.datasets[i].borderColor = this.chartData.datasets[i].borderColor;
      }
    }

    // Update labels if they exist
    if (this.chartData.labels) {
      this.displayChartData.labels = this.chartData.labels;
    }

    // Trigger change detection
    this.displayChartData = { ...this.displayChartData };
    this.displayItems = this.items;
  }
}
