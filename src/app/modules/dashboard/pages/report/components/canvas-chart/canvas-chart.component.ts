import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";

@Component({
  selector: "app-canvas-chart",
  templateUrl: "./canvas-chart.component.html",
  styleUrls: ["./canvas-chart.component.scss"],
  standalone: false,
})
export class CanvasChartComponent implements OnChanges, OnDestroy {
  @Input() isLoading = false;
  @Input() chartData: any;
  @Input() chartType: ChartType = "bar";
  @Input() chartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  @Input() loadingTip = "Đang tải dữ liệu...";
  @Input() comparisonMode = false;
  @Input() dateRangeType: "day" | "this-week" | "this-month" | "week" | "month" | "custom"  = "day";
  @Input() startDate?: Date;
  @Input() endDate?: Date;

  labels: string[] = [];

  private loadingInterval?: any;
  displayChartData: any;

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

    // Restart animation if labels or comparisonMode changes while loading
    if ((changes["labels"] || changes["comparisonMode"]) && this.isLoading) {
      this.stopLoadingAnimation();
      this.startLoadingAnimation();
    }
  }

  ngOnDestroy(): void {
    this.stopLoadingAnimation();
  }

  private startLoadingAnimation(): void {
    this.labels = this.generateLabels();

    const dataLength = this.labels.length || 7;

    // Initialize with fixed starting values - always have one value at 200
    let currentData = this.generateMockData(dataLength);
    let fixedIndex = Math.floor(Math.random() * dataLength); // Random position for fixed value
    currentData[fixedIndex] = 200;

    let currentDataPrevious = this.generateMockData(dataLength, 0.8);
    let fixedIndexPrevious = Math.floor(Math.random() * dataLength);
    if (this.comparisonMode) {
      currentDataPrevious[fixedIndexPrevious] = 200;
    }

    let targetData = [...currentData]; // Copy initial data
    let targetDataPrevious = [...currentDataPrevious]; // Copy initial data

    const displayLabels = this.labels.length ? [...this.labels] : Array.from({ length: dataLength }, (_, i) => `${i + 1}`);

    this.displayChartData = {
      labels: displayLabels,
      datasets: [
        {
          label: this.comparisonMode ? "Kỳ hiện tại" : "Dữ liệu",
          data: [...currentData],
          backgroundColor: "#e2e8f0",
          borderColor: "#cbd5e1",
          borderWidth: 1,
        },
        ...(this.comparisonMode
          ? [
              {
                label: "Kỳ trước",
                data: [...currentDataPrevious],
                backgroundColor: "#f1f5f9",
                borderColor: "#e2e8f0",
                borderWidth: 1,
              },
            ]
          : []),
      ],
    };

    // Smooth animation with interpolation
    this.loadingInterval = setInterval(() => {
      if (!this.isLoading) {
        clearInterval(this.loadingInterval);
        return;
      }

      // Change fixed index position every few iterations
      if (Math.random() < 0.3) {
        // 30% chance to change position
        const oldIndex = fixedIndex;
        fixedIndex = Math.floor(Math.random() * dataLength);
        // Restore old position to normal value
        if (oldIndex !== fixedIndex) {
          targetData[oldIndex] = Math.floor(Math.random() * 150 + 50);
        }
        currentData[fixedIndex] = 200;
        targetData[fixedIndex] = 200;

        if (this.comparisonMode) {
          const oldIndexPrevious = fixedIndexPrevious;
          fixedIndexPrevious = Math.floor(Math.random() * dataLength);
          if (oldIndexPrevious !== fixedIndexPrevious) {
            targetDataPrevious[oldIndexPrevious] = Math.floor((Math.random() * 150 + 50) * 0.8);
          }
          currentDataPrevious[fixedIndexPrevious] = 200;
          targetDataPrevious[fixedIndexPrevious] = 200;
        }
      }

      // Interpolate current data towards target
      const interpolationFactor = 0.35;
      for (let i = 0; i < dataLength; i++) {
        // Skip fixed element - keep it at 200
        if (i === fixedIndex) {
          currentData[fixedIndex] = 200;
          targetData[fixedIndex] = 200;
          continue;
        }

        currentData[i] += (targetData[i] - currentData[i]) * interpolationFactor;

        // Generate new target when close enough
        if (Math.abs(targetData[i] - currentData[i]) < 5) {
          targetData[i] = Math.floor(Math.random() * 150 + 50);
        }
      }

      // Handle comparison mode separately
      if (this.comparisonMode) {
        for (let i = 0; i < dataLength; i++) {
          if (i === fixedIndexPrevious) {
            currentDataPrevious[fixedIndexPrevious] = 200;
            targetDataPrevious[fixedIndexPrevious] = 200;
            continue;
          }

          currentDataPrevious[i] += (targetDataPrevious[i] - currentDataPrevious[i]) * interpolationFactor;

          if (Math.abs(targetDataPrevious[i] - currentDataPrevious[i]) < 5) {
            targetDataPrevious[i] = Math.floor((Math.random() * 150 + 50) * 0.8);
          }
        }
      }

      // Update data in place to avoid chart reload
      if (this.displayChartData?.datasets?.[0]) {
        this.displayChartData.datasets[0].data = [...currentData];
        if (this.comparisonMode && this.displayChartData.datasets[1]) {
          this.displayChartData.datasets[1].data = [...currentDataPrevious];
        }

        // Create new reference to trigger change detection
        this.displayChartData = {
          ...this.displayChartData,
          datasets: [...this.displayChartData.datasets],
        };
      }
    }, 300);
  }

  private stopLoadingAnimation(): void {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = undefined;
    }
  }

  private transitionToRealData(): void {
    if (!this.displayChartData?.datasets || !this.chartData?.datasets) return;

    this.displayChartData.labels = this.chartData.labels;

    // Update each dataset's data and colors smoothly
    for (let i = 0; i < this.chartData.datasets.length; i++) {
      if (this.displayChartData.datasets[i] && this.chartData.datasets[i]) {
        this.displayChartData.datasets[i].data = this.chartData.datasets[i].data;
        this.displayChartData.datasets[i].label = this.chartData.datasets[i].label;
        this.displayChartData.datasets[i].backgroundColor = this.chartData.datasets[i].backgroundColor;
        this.displayChartData.datasets[i].borderColor = this.chartData.datasets[i].borderColor;
        this.displayChartData.datasets[i].originalLabels = this.chartData.datasets[i].originalLabels;
        this.displayChartData.datasets[i].fill = this.chartData.datasets[i].fill;
        this.displayChartData.datasets[i].tension = this.chartData.datasets[i].tension;
      }
    }

    // Trigger change detection
    this.displayChartData = { ...this.displayChartData };
  }

  private generateMockData(count: number, multiplier: number = 1): number[] {
    return Array.from({ length: count }, () => Math.floor((Math.random() * 150 + 50) * multiplier));
  }

  private generateLabels(): string[] {
    const labels: string[] = [];
    let count = 7;

    switch (this.dateRangeType) {
      case "day":
        count = 24;
        for (let i = 0; i < count; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case "week":
        count = 7;
        if (this.startDate) {
          const startOfWeek = new Date(this.startDate);
          for (let i = 0; i < count; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
          }
        } else {
          for (let i = 0; i < count; i++) {
            labels.push(`${i + 1}`);
          }
        }
        break;
      case "month":
        count = 30;
        if (this.startDate) {
          const startOfMonth = new Date(this.startDate);
          for (let i = 1; i <= count; i++) {
            labels.push(`${i}/${startOfMonth.getMonth() + 1}`);
          }
        } else {
          for (let i = 1; i <= count; i++) {
            labels.push(`${i}`);
          }
        }
        break;
      case "custom":
        if (this.startDate && this.endDate) {
          // Normalize dates to compare only date parts (ignore time)
          const start = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
          const end = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate());
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

          // Same day - show hours like "day" mode
          if (days === 0) {
            count = 24;
            for (let i = 0; i < count; i++) {
              labels.push(`${i}:00`);
            }
          }
          // Multiple days - show dates like "week/month" mode
          else {
            count = Math.min(days + 1, 30);
            const startDate = new Date(this.startDate);
            for (let i = 0; i < count; i++) {
              const date = new Date(startDate);
              date.setDate(startDate.getDate() + i);
              labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
            }
          }
        } else {
          labels.push(...Array.from({ length: 7 }, (_, i) => `Ngày ${i + 1}`));
        }
        break;
    }

    return labels;
  }
}
