import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Bus, Bus2Create, SearchBus } from './model/bus.model';
import { BusesService } from './service/buses.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss'],
  standalone: false,
})
export class BusesComponent implements OnInit {
  searchBus: SearchBus = new SearchBus();

  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

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
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBus = true;
    this.busesService.searchBus(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBus) => {
        if (res) {
          this.searchBus = res;
          console.log('🚀 ~ BusesComponent ~ this.busesService.searchBus ~ this.searchBus:', this.searchBus);
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

  onCurrentPageDataChange(event: any): void {
    const buses = event as readonly Bus[];
    this.searchBus.buses = [...buses];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBus.buses;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBus.buses.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(_id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(_id);
    } else {
      this.setOfCheckedId.delete(_id);
    }
  }

  onItemChecked(_id: string, checked: boolean): void {
    this.updateCheckedSet(_id, checked);
    this.refreshCheckedStatus();
  }

  deleteBus(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete Bus',
        content:
          'Are you sure you want to delete this bus? All of your data will be permanently removed. This action cannot be undone.',
        btn: [
          {
            label: 'NO',
            type: 'cancel',
          },
          {
            label: 'YES',
            type: 'submit',
          },
        ],
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
    this.router.navigateByUrl('/management/bus-management/buses/bus-detail', { state: params });
  }

  addBus(): void {
    this.router.navigate(['/management/bus-management/buses/bus-detail']);
  }

  cloneData(bus: Bus): void {
    delete (bus as any)._id;
    let bus2Create = new Bus2Create();
    bus2Create = { ...bus2Create, ...bus };

    this.busesService.createBus(bus2Create).subscribe({
      next: (res: Bus) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
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
        onClick: () => {},
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
