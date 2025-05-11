import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusRoutesService } from './service/bus-routes.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusRoute, SearchBusRoute } from './model/bus-route.model';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss'],
  standalone: false
})
export class BusRoutesComponent implements OnInit {
  searchBusRoute: SearchBusRoute = new SearchBusRoute();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusRoute: boolean = false;

  constructor(
    private busRoutesService: BusRoutesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusRoute = true;
    this.busRoutesService.searchBusRoute(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusRoute) => {
        if (res) {
          this.searchBusRoute = res;
          this.totalItem = this.searchBusRoute.totalItem;
          this.totalPage = this.searchBusRoute.totalPage;
        }
        this.isLoadingBusRoute = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusRoute = false;
      },
    });
  }

  toggleBusRoute(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusRoute.busRoutes = this.searchBusRoute.busRoutes.map((busRoute: BusRoute) => ({
      ...busRoute,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusRoute.busRoutes.some((busRoute) => !busRoute.selected);
  }

  deleteBusRoute(id: string): void {
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
        this.busRoutesService.deleteBusRoute(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusRoute.busRoutes = this.searchBusRoute.busRoutes.filter((bus) => bus._id !== id);
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
    this.router.navigateByUrl('/bus-management/bus-routes/bus-route-detail', { state: params });
  }

  addBusRoute(): void {
    this.router.navigate(['/bus-management/bus-routes/bus-route-detail']);
  }

  reloadBusRoutePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusRoutePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusRoutePage(sortBy: string) {
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
