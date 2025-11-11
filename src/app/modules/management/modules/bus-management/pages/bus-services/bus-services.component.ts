import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusService, BusService2Create, SearchBusService } from './model/bus-service.model';
import { BusServiceDetailDialogComponent } from './component/bus-service-detail-dialog/bus-service-detail-dialog.component';
import { BusServicesService } from './service/bus-services.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-bus-services',
  templateUrl: './bus-services.component.html',
  styleUrls: ['./bus-services.component.scss'],
  standalone: false,
})
export class BusServicesComponent implements OnInit {
  searchBusService: SearchBusService = new SearchBusService();

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
    private busServicesService: BusServicesService,
    private dialog: MatDialog,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.busServicesService.searchBusService(this.searchParams).subscribe({
      next: (res: SearchBusService) => {
        if (res) {
          this.searchBusService = res;
          this.totalItem = this.searchBusService.totalItem;
          this.totalPage = this.searchBusService.totalPage;
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
    const busServices = event as readonly BusService[];
    this.searchBusService.busServices = [...busServices];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusService.busServices;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusService.busServices.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusService(busService: BusService): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete BusService',
        content:
          'Are you sure you want to delete this busService? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busServicesService.deleteBusService(busService._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusService.busServices = this.searchBusService.busServices.filter(
                (bs) => bs._id !== busService._id,
              );
              toast.success('BusService deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusService(busService: BusService): void {
    const dialogRef = this.dialog.open(BusServiceDetailDialogComponent, {
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
          iconId: result.iconId,
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
    const dialogRef = this.dialog.open(BusServiceDetailDialogComponent, {
      data: {
        title: 'Add New BusService',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busService2Create = new BusService2Create();
        busService2Create.name = result.name;
        busService2Create.iconId = result.iconId;

        this.busServicesService.processCreateBusService(result.files, busService2Create).subscribe({
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

  cloneData(busService: BusService): void {
    delete (busService as any)._id;
    let busService2Create = new BusService2Create();
    busService2Create = { ...busService2Create, ...busService };

    this.busServicesService.createBusService(busService2Create).subscribe({
      next: (res: BusService) => {
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
