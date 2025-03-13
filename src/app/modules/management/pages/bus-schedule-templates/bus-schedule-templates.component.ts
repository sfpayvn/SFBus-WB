import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusScheduleTemplatesService } from './service/bus-schedule-templates.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { BusScheduleTemplate, SearchBusScheduleTemplate } from './model/bus-schedule-template.model';

@Component({
  selector: 'app-bus-schedule-templates',
  templateUrl: './bus-schedule-templates.component.html',
  styleUrls: ['./bus-schedule-templates.component.scss'],
  standalone: false
})
export class BusScheduleTemplatesComponent implements OnInit {
  searchBusScheduleTemplate: SearchBusScheduleTemplate = new SearchBusScheduleTemplate();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBus: boolean = false;

  constructor(
    private busScheduleTemplatesService: BusScheduleTemplatesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBus = true;
    this.busScheduleTemplatesService.searchBusScheduleTemplate(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusScheduleTemplate) => {
        if (res) {
          this.searchBusScheduleTemplate = res;
          console.log("🚀 ~ BusesComponent ~ this.busScheduleTemplatesService.searchBus ~ this.searchBusScheduleTemplate:", this.searchBusScheduleTemplate)
          this.totalItem = this.searchBusScheduleTemplate.totalItem;
          this.totalPage = this.searchBusScheduleTemplate.totalPage;
        }
        this.isLoadingBus = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBus = false;
      },
    });
  }

  toggleBus(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusScheduleTemplate.busScheduleTemplates = this.searchBusScheduleTemplate.busScheduleTemplates.map((busScheduleTemplate: BusScheduleTemplate) => ({
      ...busScheduleTemplate,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusScheduleTemplate.busScheduleTemplates.some((busScheduleTemplate) => !busScheduleTemplate.selected);
  }

  deleteBusScheduleTemplate(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete Bus Schedule Template',
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
        this.busScheduleTemplatesService.deleteBusScheduleTemplate(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusScheduleTemplate.busScheduleTemplates = this.searchBusScheduleTemplate.busScheduleTemplates.filter((bus) => bus._id !== id);
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusScheduleTemplate(busScheduleTemplate: BusScheduleTemplate): void {
    const params = { busScheduleTemplate: JSON.stringify(busScheduleTemplate) };
    this.router.navigateByUrl('/management/bus-schedule-templates/bus-schedule-template-detail', { state: params });
  }

  addBusScheduleTemplate(): void {
    this.router.navigate(['/management/bus-schedule-templates/bus-schedule-template-detail']);
  }

  reloadBusScheduleTemplatePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusScheduleTemplatePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusScheduleTemplatePage(sortBy: string) {
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
