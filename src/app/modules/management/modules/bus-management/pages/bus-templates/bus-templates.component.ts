import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusTemplate, BusTemplate2Create, SearchBusTemplate } from './model/bus-template.model';
import { BusTemplatesService } from './service/bus-templates.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-bus-templates',
  templateUrl: './bus-templates.component.html',
  styleUrls: ['./bus-templates.component.scss'],
  standalone: false,
})
export class BusTemplatesComponent implements OnInit {
  searchBusTemplate: SearchBusTemplate = new SearchBusTemplate();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusTemplate: boolean = false;

  constructor(
    private busTemplatesService: BusTemplatesService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusTemplate = true;
    this.busTemplatesService.searchBusTemplate(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusTemplate) => {
        if (res) {
          this.searchBusTemplate = res;
          console.log(
            '🚀 ~ BusTemplatesComponent ~ this.busTemplatesService.searchBusTemplate ~ this.searchBusTemplate:',
            this.searchBusTemplate,
          );
          this.totalItem = this.searchBusTemplate.totalItem;
          this.totalPage = this.searchBusTemplate.totalPage;
        }
        this.isLoadingBusTemplate = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusTemplate = false;
      },
    });
  }

  toggleBusTemplate(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusTemplate.busTemplates = this.searchBusTemplate.busTemplates.map((busTemplate: BusTemplate) => ({
      ...busTemplate,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusTemplate.busTemplates.some((busTemplate: BusTemplate) => !busTemplate.selected);
  }

  deleteBusTemplate(busTemplate: BusTemplate): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete Bus',
        content:
          'Are you sure you want to delete this bus? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busTemplatesService.deleteBusTemplate(busTemplate._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusTemplate.busTemplates = this.searchBusTemplate.busTemplates.filter(
                (bt: BusTemplate) => bt._id !== busTemplate._id,
              );
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusTemplate(busTemplate: BusTemplate): void {
    const params = { busTemplate: JSON.stringify(busTemplate) };
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-templates/bus-template-detail', {
      state: params,
    });
  }

  addBusTemplate(): void {
    this.router.navigate(['/management/bus-management/bus-design/bus-templates/bus-template-detail']);
  }

  cloneData(busTemplate: BusTemplate): void {
    delete (busTemplate as any)._id;
    let busTemplateCreate = new BusTemplate2Create();
    busTemplateCreate = { ...busTemplateCreate, ...busTemplate };

    this.busTemplatesService.createBusTemplate(busTemplateCreate).subscribe({
      next: (res: BusTemplate) => {
        if (res) {
          this.loadData();
          toast.success('Nhân bản thành công');
        }
      },
      error: (error: any) => this.utils.handleRequestError(error),
    });
  }

  reloadBusTemplatePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusTemplatePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusTemplatePage(sortBy: string) {
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
