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

  isLoadingBus: boolean = false;

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
    this.isLoadingBus = true;
    this.busSchedulesService.searchBusSchedule(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusSchedule) => {
        if (res) {
          this.searchBusSchedule = res;
          console.log("🚀 ~ BusesComponent ~ this.busSchedulesService.searchBus ~ this.searchBusSchedule:", this.searchBusSchedule)
          this.totalItem = this.searchBusSchedule.totalItem;
          this.totalPage = this.searchBusSchedule.totalPage;
        }
        this.isLoadingBus = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBus = false;
      },
    });
  }

  toggleBus(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusSchedule.busSchedules = this.searchBusSchedule.busSchedules.map((busSchedule: BusSchedule) => ({
      ...busSchedule,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusSchedule.busSchedules.some((busSchedule) => !busSchedule.selected);
  }

  deleteBus(id: string): void {
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

  editBus(busSchedule: BusSchedule): void {
    const params = { busSchedule: JSON.stringify(busSchedule) };
    this.router.navigateByUrl('/management/bus-routes/bus-route-detail', { state: params });
  }

  addBus(): void {
    this.router.navigate(['/management/bus-routes/bus-route-detail']);
  }

  reloadBusPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusPage(sortBy: string) {
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
