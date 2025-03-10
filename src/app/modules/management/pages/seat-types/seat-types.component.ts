import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { SeatType, SeatType2Create, SearchSeatType } from './model/seat-type.model';
import { CreateEditSeatTypeDialogComponent } from './component/create-edit-seat-types-dialog/create-seat-type-dialog.component';
import { SeatTypesService } from './service/seat-types.servive';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-seat-types',
  templateUrl: './seat-types.component.html',
  styleUrls: ['./seat-types.component.scss'],
  standalone: false
})
export class SeatTypesComponent implements OnInit {
  searchSeatType: SearchSeatType = new SearchSeatType();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingSeatType: boolean = false;

  constructor(
    private seatTypesService: SeatTypesService,
    private dialog: MatDialog,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingSeatType = true;
    this.seatTypesService.searchSeatType(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchSeatType) => {
        if (res) {
          this.searchSeatType = res;
          this.totalItem = this.searchSeatType.totalItem;
          this.totalPage = this.searchSeatType.totalPage;
        }
        this.isLoadingSeatType = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingSeatType = false;
      },
    });
  }

  toggleSeatType(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchSeatType.seatTypes = this.searchSeatType.seatTypes.map((seatType: SeatType) => ({
      ...seatType,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchSeatType.seatTypes.some((seatType) => !seatType.selected);
  }

  deleteSeatType(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete SeatType',
        content:
          'Are you sure you want to delete this seatType? All of your data will be permanently removed. This action cannot be undone.',
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
        this.seatTypesService.deleteSeatType(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchSeatType.seatTypes = this.searchSeatType.seatTypes.filter((seatType) => seatType._id !== id);
              toast.success('SeatType deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editSeatType(seatType: SeatType): void {
    const dialogRef = this.dialog.open(CreateEditSeatTypeDialogComponent, {
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
    const dialogRef = this.dialog.open(CreateEditSeatTypeDialogComponent, {
      data: {
        title: 'Add New SeatType',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        const seatType2Create = new SeatType2Create();
        seatType2Create.name = result.name;
        seatType2Create.isEnv = result.isEnv;

        this.seatTypesService.createSeatType(result.files, seatType2Create).subscribe({
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

  reloadSeatTypePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchSeatTypePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortSeatTypePage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }
}
