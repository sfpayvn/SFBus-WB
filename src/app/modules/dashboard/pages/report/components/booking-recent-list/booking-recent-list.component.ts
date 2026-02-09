import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SEAT_STATUS_LABELS, BOOKING_STATUS_LABELS, BOOKING_STATUS_CLASSES } from "@rsApp/core/constants/status.constants";
import { Booking, SearchBooking } from "@rsApp/modules/management/modules/booking-management/model/booking.model";
import { BookingService } from "@rsApp/modules/management/modules/booking-management/service/booking.service";
import { SeatType } from "@rsApp/modules/management/modules/bus-management/pages/seat-types/model/seat-type.model";
import { SeatTypesService } from "@rsApp/modules/management/modules/bus-management/pages/seat-types/service/seat-types.servive";
import { Utils } from "@rsApp/shared/utils/utils";
import { combineLatest } from "rxjs";

@Component({
  selector: "app-booking-recent-list",
  templateUrl: "./booking-recent-list.component.html",
  styleUrls: ["./booking-recent-list.component.scss"],
  standalone: false,
})
export class BookingRecentListComponent implements OnInit {
  bookins: Booking[] = [];

  searchParams = {
    pageIdx: 1,
    startDate: "" as Date | "",
    endDate: "" as Date | "",
    pageSize: 5,
    keyword: "",
    sortBy: {
      key: "createdAt",
      value: "descend",
    },
    filters: [] as any[],
  };

  private seatTypeCache = new Map<string, SeatType | undefined>();

  statusClasses: { [key: string]: string } = {
    not_picked_up: "bg-yellow-100 border-yellow-300",
    picked_up: "bg-blue-100 border-blue-300 ",
    on_board: "bg-green-100 border-green-300 ",
    dropped_off: "bg-purple-100 border-purple-300 ",
  };

  seatStatuses = SEAT_STATUS_LABELS;
  bookingStatuses = BOOKING_STATUS_LABELS;
  bookingStatusClasses = BOOKING_STATUS_CLASSES;

  isLoaded: boolean = false;
  expandedBookingIds = new Set<string>();

  seatTypes: SeatType[] = [];

  constructor(
    private router: Router,
    private bookingService: BookingService,
    public utils: Utils,
    private seatTypesService: SeatTypesService,
  ) {}

  toggleExpand(bookingId: string): void {
    if (this.expandedBookingIds.has(bookingId)) {
      this.expandedBookingIds.delete(bookingId);
    } else {
      this.expandedBookingIds.add(bookingId);
    }
  }

  isExpanded(bookingId: string): boolean {
    return this.expandedBookingIds.has(bookingId);
  }

  async ngOnInit(): Promise<void> {
    await this.initData();
  }

  async initData(): Promise<void> {
    const findSeatTypes = this.seatTypesService.findAll();

    let request = [findSeatTypes];
    combineLatest(request).subscribe(([seatTypes]) => {
      this.seatTypes = seatTypes;
      // Clear cache when seat types change
      this.seatTypeCache.clear();
      this.loadBooking();
    });
  }

  loadBooking() {
    this.isLoaded = false;

    try {
      this.bookingService.searchBooking(this.searchParams).subscribe({
        next: (res: SearchBooking) => {
          if (res) {
            this.bookins = res.bookings;
            console.log("🚀 ~ BookingRecentListComponent ~ loadBooking ~ this.bookins:", this.bookins);
          }
          this.isLoaded = true;
        },
        error: (error: any) => {
          this.utils.handleRequestError(error);
          this.isLoaded = true;
        },
      });
    } catch (err) {
      this.isLoaded = true;
      this.utils.handleUnexpectedError(err);
    }
  }

  getTypeOfSeat(cell: any) {
    if (!cell?.typeId) {
      return undefined;
    }

    // Check cache first
    if (this.seatTypeCache.has(cell.typeId)) {
      return this.seatTypeCache.get(cell.typeId);
    }

    // Compute and cache the result
    const selectedType = this.seatTypes.find((t) => t._id === cell.typeId);
    this.seatTypeCache.set(cell.typeId, selectedType);

    return selectedType;
  }

  // Thêm các helper methods
  getSeatStatusLabel(status: string): string {
    return this.seatStatuses[status] || "Không xác định";
  }

  getSeatStatusClass(status: string): string {
    return this.statusClasses[status] || "bg-gray-100 text-gray-800";
  }

  getBookingStatusLabel(status: string): string {
    return this.bookingStatuses[status] || "Không xác định";
  }

  getBookingStatusClass(status: string): string {
    return this.bookingStatusClasses[status] || "border-gray-300 bg-gray-100 text-gray-800";
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  viewDetailBooking(booking: Booking) {
    this.router.navigate(["/booking/detail"], { state: { booking } });
  }
}
