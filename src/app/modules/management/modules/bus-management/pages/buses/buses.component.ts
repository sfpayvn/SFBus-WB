import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Bus, SearchBus } from './model/bus.model';
import { BusesService } from './service/buses.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss'],
  standalone: false
})
export class BusesComponent implements OnInit {
  searchBus: SearchBus = new SearchBus();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBus: boolean = false;

  constructor(
    private busesService: BusesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBus = true;
    this.busesService.searchBus(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBus) => {
        if (res) {
          this.searchBus = res;
          console.log("🚀 ~ BusesComponent ~ this.busesService.searchBus ~ this.searchBus:", this.searchBus)
          this.totalItem = this.searchBus.totalItem;
          this.totalPage = this.searchBus.totalPage;
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
    this.searchBus.buses = this.searchBus.buses.map((bus: Bus) => ({
      ...bus,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBus.buses.some((bus) => !bus.selected);
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
        this.busesService.deleteBus(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBus.buses = this.searchBus.buses.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBus(bus: Bus): void {
    const params = { bus: JSON.stringify(bus) };
    this.router.navigateByUrl('/bus-management/buses/bus-detail', { state: params });
  }

  addBus(): void {
    this.router.navigate(['/bus-management/buses/bus-detail']);
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
