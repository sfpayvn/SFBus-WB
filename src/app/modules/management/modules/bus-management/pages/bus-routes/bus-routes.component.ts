import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusRoutesService } from './service/bus-routes.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusRoute, BusRoute2Create, SearchBusRoute } from './model/bus-route.model';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { SeatType } from '../seat-types/model/seat-type.model';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss'],
  standalone: false,
})
export class BusRoutesComponent implements OnInit {
  searchBusRoute: SearchBusRoute = new SearchBusRoute();

  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  totalPage: number = 0;
  totalItem: number = 0;

  searchParams = {
    pageIdx: 1,
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [] as any[],
  };

  isLoading: boolean = false;

  constructor(
    private busRoutesService: BusRoutesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.busRoutesService.searchBusRoute(this.searchParams).subscribe({
      next: (res: SearchBusRoute) => {
        if (res) {
          this.searchBusRoute = res;
          this.totalItem = this.searchBusRoute.totalItem;
          this.totalPage = this.searchBusRoute.totalPage;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoading = false;
      },
    });
  }

  onCurrentPageDataChange(event: any): void {
    const busRoutes = event as readonly BusRoute[];
    this.searchBusRoute.busRoutes = [...busRoutes];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusRoute.busRoutes;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusRoute.busRoutes.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusRoute(busRoute: BusRoute): void {
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
        this.busRoutesService.deleteBusRoute(busRoute._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusRoute.busRoutes = this.searchBusRoute.busRoutes.filter((br) => br._id !== busRoute._id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusRoute(busRoute: BusRoute): void {
    const params = { busRoute: JSON.stringify(busRoute) };
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-routes/bus-route-detail', { state: params });
  }

  addBusRoute(): void {
    this.router.navigate(['/management/bus-management/bus-design/bus-routes/bus-route-detail']);
  }

  cloneData(busRoute: BusRoute): void {
    delete (busRoute as any)._id;
    let busRoute2Create = new BusRoute2Create();
    busRoute2Create = { ...busRoute2Create, ...busRoute };

    this.busRoutesService.createBusRoute(busRoute2Create).subscribe({
      next: (res: BusRoute) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  reloadPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchPage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
  }

  sortPage(sortBy: { key: string; value: string }) {
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
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
