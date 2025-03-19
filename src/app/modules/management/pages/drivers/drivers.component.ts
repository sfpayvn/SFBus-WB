import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { SearchDriver, Driver } from './model/driver.model';
import { DriversService } from './service/driver.servive';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
  standalone: false
})
export class DriversComponent implements OnInit {
  searchDriver: SearchDriver = new SearchDriver();
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingDriver: boolean = false;

  constructor(
    private driversService: DriversService,
    private dialog: MatDialog,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingDriver = true;
    this.driversService.searchDriver(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchDriver) => {
        if (res) {
          this.searchDriver = res;
          this.totalItem = this.searchDriver.totalItem;
          this.totalPage = this.searchDriver.totalPage;
        }
        this.isLoadingDriver = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingDriver = false;
      },
    });
  }

  toggleDriver(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchDriver.drivers = this.searchDriver.drivers.map((driver: Driver) => ({
      ...driver,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchDriver.drivers.some((driver) => !driver.selected);
  }

  deleteDriver(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Driver',
        content:
          'Are you sure you want to delete this driver? All of your data will be permanently removed. This action cannot be undone.',
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
        this.driversService.deleteDriver(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchDriver.drivers = this.searchDriver.drivers.filter((driver) => driver._id !== id);
              toast.success('Driver deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editDriver(driver: Driver): void {

  }

  addDriver(): void {

  }

  reloadDriverPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchDriverPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortDriverPage(sortBy: string) {
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
