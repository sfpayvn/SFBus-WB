import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusLayoutTemplate, SearchBusLayoutTemplate } from './model/bus-layout-templates.model';
import { BusLayoutTemplatesService } from './service/bus-layout-templates.servive';
import { Router } from '@angular/router';
import { Utils } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-bus-layout-templates',
  templateUrl: './bus-layout-templates.component.html',
  styleUrls: ['./bus-layout-templates.component.scss'],
  standalone: false
})
export class BusLayoutTemplatesComponent implements OnInit {
  searchBusLayoutTemplate: SearchBusLayoutTemplate = new SearchBusLayoutTemplate();
  selectAll: boolean = false;

  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingBusLayoutTemplate: boolean = false;

  constructor(
    private busTemplateService: BusLayoutTemplatesService,
    private dialog: MatDialog,
    private router: Router,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingBusLayoutTemplate = true;
    this.busTemplateService.searchBusLayoutTemplate(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
      next: (res: SearchBusLayoutTemplate) => {
        if (res) {
          this.searchBusLayoutTemplate = res;
          this.totalItem = this.searchBusLayoutTemplate.totalItem;
          this.totalPage = this.searchBusLayoutTemplate.totalPage;
        }
        this.isLoadingBusLayoutTemplate = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingBusLayoutTemplate = false;
      },
    });
  }

  toggleBusLayoutTemplate(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchBusLayoutTemplate.busLayoutTemplates = this.searchBusLayoutTemplate.busLayoutTemplates.map((busTemplate: BusLayoutTemplate) => ({
      ...busTemplate,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchBusLayoutTemplate.busLayoutTemplates.some((busLayoutTemplate) => !busLayoutTemplate.selected);
  }

  deleteBusLayoutTemplate(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete BusLayoutTemplate',
        content:
          'Are you sure you want to delete this busTemplate? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busTemplateService.deleteBusLayoutTemplate(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusLayoutTemplate.busLayoutTemplates = this.searchBusLayoutTemplate.busLayoutTemplates.filter((busLayoutTemplate) => busLayoutTemplate._id !== id);
              toast.success('BusLayoutTemplate deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editBusLayoutTemplate(busLayoutTemplate: BusLayoutTemplate): void {
    const params = { busLayoutTemplate: JSON.stringify(busLayoutTemplate) };
    this.router.navigateByUrl('/bus-management/bus-layout-templates/bus-layout-template-detail', { state: params });
  }

  addBusLayoutTemplate(): void {
    this.router.navigate(['/bus-management/bus-layout-templates/bus-layout-template-detail']);
  }

  reloadBusLayoutTemplatePage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchBusLayoutTemplatePage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortBusLayoutTemplatePage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }
}
