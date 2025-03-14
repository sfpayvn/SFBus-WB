import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusScheduleAutoGeneratorsService } from './service/bus-schedule-autogenerators.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusScheduleAutoGenerator, SearchBusScheduleAutoGenerator } from './model/bus-schedule-autogenerator.model';

@Component({
  selector: 'app-bus-schedules',
  templateUrl: './bus-schedule-autogenerator.component.html',
  styleUrls: ['./bus-schedule-autogenerator.component.scss'],
  standalone: false
})
export class BusScheduleAutoGeneratorsComponent implements OnInit {
  searchBusScheduleAutoGenerator: SearchBusScheduleAutoGenerator = new SearchBusScheduleAutoGenerator();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusScheduleAutoGenerator: boolean = false;

  constructor(
    private busScheduleAutoGeneratorsService: BusScheduleAutoGeneratorsService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusScheduleAutoGenerator = true;
    this.busScheduleAutoGeneratorsService.searchBusScheduleAutoGenerator(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusScheduleAutoGenerator) => {
        if (res) {
          this.searchBusScheduleAutoGenerator = res;
          console.log("🚀 ~ BusesComponent ~ this.busScheduleAutoGeneratorsService.searchBus ~ this.searchBusScheduleAutoGenerator:", this.searchBusScheduleAutoGenerator)
          this.totalItem = this.searchBusScheduleAutoGenerator.totalItem;
          this.totalPage = this.searchBusScheduleAutoGenerator.totalPage;
        }
        this.isLoadingBusScheduleAutoGenerator = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusScheduleAutoGenerator = false;
      },
    });
  }

  toggleBusScheduleAutoGenerator(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators = this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.map((busScheduleAutoGenerator: BusScheduleAutoGenerator) => ({
      ...busScheduleAutoGenerator,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.some((busScheduleAutoGenerator) => !busScheduleAutoGenerator.selected);
  }

  deleteBusScheduleAutoGenerator(id: string): void {
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
        this.busScheduleAutoGeneratorsService.deleteBusScheduleAutoGenerator(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators = this.searchBusScheduleAutoGenerator.busScheduleAutoGenerators.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusScheduleAutoGenerator(busScheduleAutoGenerator: BusScheduleAutoGenerator): void {
    const params = { busScheduleAutoGenerator: JSON.stringify(busScheduleAutoGenerator) };
    this.router.navigateByUrl('/management/bus-schedules/bus-schedule-detail', { state: params });
  }

  addBusScheduleAutoGenerator(): void {
    this.router.navigate(['/management/bus-schedules/bus-schedule-detail']);
  }

  reloadBusScheduleAutoGeneratorPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusScheduleAutoGeneratorPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusScheduleAutoGeneratorPage(sortBy: string) {
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
