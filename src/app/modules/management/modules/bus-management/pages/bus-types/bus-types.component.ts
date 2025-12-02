import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusType, BusType2Create, SearchBusType } from './model/bus-type.model';
import { BusTypeDetailDialogComponent } from './component/bus-type-detail-dialog/bus-type-detail-dialog.component';
import { BusTypesService } from './service/bus-types.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-bus-types',
  templateUrl: './bus-types.component.html',
  styleUrls: ['./bus-types.component.scss'],
  standalone: false,
})
export class BusTypesComponent implements OnInit {
  searchBusType: SearchBusType = new SearchBusType();

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
    private busTypesService: BusTypesService,
    private dialog: MatDialog,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.busTypesService.searchBusType(this.searchParams).subscribe({
      next: (res: SearchBusType) => {
        if (res) {
          this.searchBusType = res;
          this.totalItem = this.searchBusType.totalItem;
          this.totalPage = this.searchBusType.totalPage;
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
    const busTypes = event as readonly BusType[];
    this.searchBusType.busTypes = [...busTypes];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusType.busTypes;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusType.busTypes.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusType(busType: BusType): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete BusType',
        content:
          'Are you sure you want to delete this busType? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busTypesService.deleteBusType(busType._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusType.busTypes = this.searchBusType.busTypes.filter((bt) => bt._id !== busType._id);
              toast.success('BusType deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusType(busType: BusType): void {
    const dialogRef = this.dialog.open(BusTypeDetailDialogComponent, {
      data: {
        title: 'Cập nhật Loại Xe',
        busType: { ...busType },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busType2Update = { ...result.busType };

        this.busTypesService.updateBusType(busType2Update).subscribe({
          next: (res: BusType) => {
            if (res) {
              this.searchBusType.busTypes = this.searchBusType.busTypes.map((busType: BusType) =>
                busType._id === res._id ? { ...busType, ...res } : busType,
              );
              toast.success('Cập nhật Loại Xe thành công');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  addBusType(): void {
    const dialogRef = this.dialog.open(BusTypeDetailDialogComponent, {
      data: {
        title: 'Thêm Loại Xe',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.busTypesService.createBusType(result.busType).subscribe({
          next: (res: BusType) => {
            if (res) {
              this.loadData();
              toast.success('Thêm Loại Xe thành công');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(busType: BusType): void {
    delete (busType as any)._id;
    let busType2Create = new BusType2Create();
    busType2Create = { ...busType2Create, ...busType };

    this.busTypesService.createBusType(busType2Create).subscribe({
      next: (res: BusType) => {
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
