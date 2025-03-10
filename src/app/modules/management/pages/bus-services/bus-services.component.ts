import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusService, BusService2Create, SearchBusService } from './model/bus-service.model';
import { CreateEditBusServiceDialogComponent } from './component/create-edit-bus-service-dialog/create-bus-service-dialog.component';
import { BusServicesService } from './service/bus-services.servive';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-bus-services',
  templateUrl: './bus-services.component.html',
  styleUrls: ['./bus-services.component.scss'],
  standalone: false
})
export class BusServicesComponent implements OnInit {
  searchBusService: SearchBusService = new SearchBusService();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusService: boolean = false;

  constructor(
    private busServicesService: BusServicesService,
    private dialog: MatDialog,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusService = true;
    this.busServicesService.searchBusService(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusService) => {
        if (res) {
          this.searchBusService = res;
          this.totalItem = this.searchBusService.totalItem;
          this.totalPage = this.searchBusService.totalPage;
        }
        this.isLoadingBusService = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusService = false;
      },
    });
  }

  toggleBusService(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusService.busServices = this.searchBusService.busServices.map((busService: BusService) => ({
      ...busService,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusService.busServices.some((busService) => !busService.selected);
  }

  deleteBusService(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete BusService',
        content:
          'Are you sure you want to delete this busService? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busServicesService.deleteBusService(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusService.busServices = this.searchBusService.busServices.filter((busService) => busService._id !== id);
              toast.success('BusService deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusService(busService: BusService): void {
    const dialogRef = this.dialog.open(CreateEditBusServiceDialogComponent, {
      data: {
        title: 'Edit BusService',
        busService: { ...busService },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busServiceType2Update = {
          ...busService,
          name: result.name,
        };
        this.busServicesService.processUpdateBusService(result.files, busServiceType2Update).subscribe({
          next: (res: BusService) => {
            if (res) {
              this.searchBusService.busServices = this.searchBusService.busServices.map((busService: BusService) =>
                busService._id === res._id ? { ...busService, ...res } : busService,
              );
              toast.success('BusService updated successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  addBusService(): void {
    const dialogRef = this.dialog.open(CreateEditBusServiceDialogComponent, {
      data: {
        title: 'Add New BusService',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        const busService2Create = new BusService2Create();
        busService2Create.name = result.name;

        this.busServicesService.createBusService(result.files, busService2Create).subscribe({
          next: (res: BusService) => {
            if (res) {
              this.loadData();
              toast.success('BusService added successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  reloadBusServicePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusServicePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusServicePage(sortBy: string) {
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
