import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { SeatType, SeatType2Create, SearchSeatType } from './model/seat-type.model';
import { SeatTypesDetailDialogComponent } from './component/seat-types-detail-dialog/seat-types-detail-dialog.component';
import { SeatTypesService } from './service/seat-types.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-seat-types',
  templateUrl: './seat-types.component.html',
  styleUrls: ['./seat-types.component.scss'],
  standalone: false,
})
export class SeatTypesComponent implements OnInit {
  searchSeatType: SearchSeatType = new SearchSeatType();

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
    private seatTypesService: SeatTypesService,
    private dialog: MatDialog,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.seatTypesService.searchSeatType(this.searchParams).subscribe({
      next: (res: SearchSeatType) => {
        if (res) {
          this.searchSeatType = res;
          this.totalItem = this.searchSeatType.totalItem;
          this.totalPage = this.searchSeatType.totalPage;
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
    const seatTypes = event as readonly SeatType[];
    this.searchSeatType.seatTypes = [...seatTypes];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchSeatType.seatTypes;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchSeatType.seatTypes.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteSeatType(seatType: SeatType): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete SeatType',
        content:
          'Are you sure you want to delete this seatType? All of your data will be permanently removed. This action cannot be undone.',
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
        this.seatTypesService.deleteSeatType(seatType._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchSeatType.seatTypes = this.searchSeatType.seatTypes.filter((st) => st._id !== seatType._id);
              toast.success('SeatType deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editSeatType(seatType: SeatType): void {
    const dialogRef = this.dialog.open(SeatTypesDetailDialogComponent, {
      data: {
        title: 'Edit SeatType',
        seatType: { ...seatType },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const seatType2Update = {
          ...seatType,
          name: result.name,
          isEnv: result.isEnv,
          iconId: result.iconId,
        };
        this.seatTypesService.processUpdateSeatType(result.files, seatType2Update).subscribe({
          next: (res: SeatType) => {
            if (res) {
              this.searchSeatType.seatTypes = this.searchSeatType.seatTypes.map((seatType: SeatType) =>
                seatType._id === res._id ? { ...seatType, ...res } : seatType,
              );
              toast.success('SeatType updated successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  addSeatType(): void {
    const dialogRef = this.dialog.open(SeatTypesDetailDialogComponent, {
      data: {
        title: 'Add New SeatType',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const seatType2Create = new SeatType2Create();
        seatType2Create.name = result.name;
        seatType2Create.isEnv = result.isEnv;
        seatType2Create.iconId = result.iconId;

        this.seatTypesService.processCreateBusService(result.files, seatType2Create).subscribe({
          next: (res: SeatType) => {
            if (res) {
              this.loadData();
              toast.success('SeatType added successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  cloneData(seatType: SeatType): void {
    delete (seatType as any)._id;
    let seatType2Create = new SeatType2Create();
    seatType2Create = { ...seatType2Create, ...seatType };

    this.seatTypesService.createSeatType(seatType2Create).subscribe({
      next: (res: SeatType) => {
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
}
