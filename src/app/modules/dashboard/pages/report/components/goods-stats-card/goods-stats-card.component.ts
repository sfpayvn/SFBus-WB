import { Component, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { StatisticCard, StatsRequest } from "../../models/report.model";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "app-goods-stats-card",
  templateUrl: "./goods-stats-card.component.html",
  styleUrls: ["./goods-stats-card.component.scss"],
  standalone: false,
})
export class GoodsStatsCardComponent implements OnInit, OnChanges {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Input() comparisonMode: boolean = false;
  @Input() comparisonStartDate?: Date;
  @Input() comparisonEndDate?: Date;

  isLoading = false;
  stats: StatisticCard = {
    title: "Hàng hóa vận chuyển",
    value: 0,
    unit: "kiện",
    icon: "assets/icons/heroicons/outline/cube.svg",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    change: "",
    changeType: "neutral",
    percentage: 0,
  };

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // Don't load here - wait for inputs to be set
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["startDate"] || changes["endDate"] || changes["comparisonMode"] || changes["comparisonStartDate"] || changes["comparisonEndDate"]) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (!this.startDate || !this.endDate) return;

    this.isLoading = true;

    const request: StatsRequest = {
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      comparisonMode: this.comparisonMode,
      comparisonStartDate: this.comparisonStartDate ? this.comparisonStartDate.toISOString() : undefined,
      comparisonEndDate: this.comparisonEndDate ? this.comparisonEndDate.toISOString() : undefined,
    };

    this.reportService.getGoodsStats(request, true).subscribe({
      next: (response: any) => {
        this.stats.value = response.total || 0;

        if (this.comparisonMode) {
          // Calculate comparison with previous period
          // You can enhance this by calling another API for previous period
          this.stats.changeType = response.changeType;
          this.stats.percentage = response.percentage;
          this.stats.change = response.change;
        } else {
          this.stats.changeType = "neutral";
          this.stats.percentage = 0;
          this.stats.change = "";
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error("Error loading booking stats:", error);
        this.isLoading = false;
      },
    });
  }
}
