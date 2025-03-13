import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusSchedulesService } from './service/bus-schedules.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusSchedule, SearchBusSchedule } from './model/bus-schedule.model';

@Component({
  selector: 'app-bus-schedules',
  templateUrl: './bus-schedules.component.html',
  styleUrls: ['./bus-schedules.component.scss'],
  standalone: false
})
export class BusSchedulesComponent implements OnInit {
  searchBusSchedule: SearchBusSchedule = new SearchBusSchedule();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusSchedule: boolean = false;

  constructor(
    private busSchedulesService: BusSchedulesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusSchedule = true;
    this.busSchedulesService.searchBusSchedule(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusSchedule) => {
        if (res) {
          this.searchBusSchedule = res;
          console.log("🚀 ~ BusesComponent ~ this.busSchedulesService.searchBus ~ this.searchBusSchedule:", this.searchBusSchedule)
          this.totalItem = this.searchBusSchedule.totalItem;
          this.totalPage = this.searchBusSchedule.totalPage;
        }
        this.isLoadingBusSchedule = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusSchedule = false;
      },
    });
  }

  toggleBusSchedule(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusSchedule.busSchedules = this.searchBusSchedule.busSchedules.map((busSchedule: BusSchedule) => ({
      ...busSchedule,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusSchedule.busSchedules.some((busSchedule) => !busSchedule.selected);
  }

  deleteBusSchedule(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Bus',
        content:
          'Are you sure you want to delete this bus? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel'
          },
          {
            label: 'YES',
            type: 'submit'
          },
        ]
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busSchedulesService.deleteBusSchedule(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusSchedule.busSchedules = this.searchBusSchedule.busSchedules.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusSchedule(busSchedule: BusSchedule): void {
    const params = { busSchedule: JSON.stringify(busSchedule) };
    this.router.navigateByUrl('/management/bus-schedules/bus-schedule-detail', { state: params });
  }

  addBusSchedule(): void {
    this.router.navigate(['/management/bus-schedules/bus-schedule-detail']);
  }

  reloadBusSchedulePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusSchedulePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusSchedulePage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
