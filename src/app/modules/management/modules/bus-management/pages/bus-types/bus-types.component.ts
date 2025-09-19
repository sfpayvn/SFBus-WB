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
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusType: boolean = false;

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
    this.isLoadingBusType = true;
    this.busTypesService.searchBusType(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusType) => {
        if (res) {
          this.searchBusType = res;
          this.totalItem = this.searchBusType.totalItem;
          this.totalPage = this.searchBusType.totalPage;
        }
        this.isLoadingBusType = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusType = false;
      },
    });
  }

  toggleBusType(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusType.busTypes = this.searchBusType.busTypes.map((busType: BusType) => ({
      ...busType,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusType.busTypes.some((busType) => !busType.selected);
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

  reloadBusTypePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusTypePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusTypePage(sortBy: string) {
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
