import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusSeatType, BusSeatType2Create, SearchBusSeatType } from './model/bus-seat-type.model';
import { CreateEditBusSeatTypeDialogComponent } from './component/create-edit-bus-seat-types-dialog/create-bus-seat-type-dialog.component';
import { BusSeatTypesService } from './service/bus-seat-types.servive';

@Component({
  selector: 'app-bus-seat-types',
  templateUrl: './bus-seat-types.component.html',
  styleUrls: ['./bus-seat-types.component.scss'],
  standalone: false
})
export class BusSeatTypesComponent implements OnInit {
  searchBusSeatType: SearchBusSeatType = new SearchBusSeatType();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusSeatType: boolean = false;

  constructor(
    private busSeatTypesService: BusSeatTypesService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusSeatType = true;
    this.busSeatTypesService.searchBusSeatType(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusSeatType) => {
        if (res) {
          this.searchBusSeatType = res;
          this.totalItem = this.searchBusSeatType.totalItem;
          this.totalPage = this.searchBusSeatType.totalPage;
        }
        this.isLoadingBusSeatType = false;
      },
      error: (error: any) => {
        this.handleRequestError(error);
        this.isLoadingBusSeatType = false;
      },
    });
  }

  toggleBusSeatType(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusSeatType.seatTypes = this.searchBusSeatType.seatTypes.map((busSeatType: BusSeatType) => ({
      ...busSeatType,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusSeatType.seatTypes.some((busSeatType) => !busSeatType.selected);
  }

  deleteBusSeatType(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete BusSeatType',
        content:
          'Are you sure you want to delete this busSeatType? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busSeatTypesService.deleteBusSeatType(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusSeatType.seatTypes = this.searchBusSeatType.seatTypes.filter((busSeatType) => busSeatType._id !== id);
              toast.success('BusSeatType deleted successfully');
            }
          },
          error: (error: any) => this.handleRequestError(error),
        });
      }
    });
  }

  editBusSeatType(busSeatType: BusSeatType): void {
    const dialogRef = this.dialog.open(CreateEditBusSeatTypeDialogComponent, {
      data: {
        title: 'Edit BusSeatType',
        busSeatType: { ...busSeatType },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const busSeatType2Update = {
          ...busSeatType,
          name: result.name,
          isEnv: result.isEnv,
        };
        this.busSeatTypesService.processUpdateBusSeatType(result.files, busSeatType2Update).subscribe({
          next: (res: BusSeatType) => {
            if (res) {
              this.searchBusSeatType.seatTypes = this.searchBusSeatType.seatTypes.map((busSeatType: BusSeatType) =>
                busSeatType._id === res._id ? { ...busSeatType, ...res } : busSeatType,
              );
              toast.success('BusSeatType updated successfully');
            }
          },
          error: (error: any) => this.handleRequestError(error),
        });
      }
    });
  }

  addBusSeatType(): void {
    const dialogRef = this.dialog.open(CreateEditBusSeatTypeDialogComponent, {
      data: {
        title: 'Add New BusSeatType',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        const busSeatType2Create = new BusSeatType2Create();
        busSeatType2Create.name = result.name;
        busSeatType2Create.isEnv = result.isEnv;

        this.busSeatTypesService.createBusSeatType(result.files, busSeatType2Create).subscribe({
          next: (res: BusSeatType) => {
            if (res) {
              this.loadData();
              toast.success('BusSeatType added successfully');
            }
          },
          error: (error: any) => this.handleRequestError(error),
        });
      }
    });
  }

  reloadBusSeatTypePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusSeatTypePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusSeatTypePage(sortBy: string) {
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
