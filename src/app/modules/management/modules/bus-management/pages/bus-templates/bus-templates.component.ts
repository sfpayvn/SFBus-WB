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
    this.isLoading = true;
    this.busTemplatesService.searchBusTemplate(this.searchParams).subscribe({
      next: (res: SearchBusTemplate) => {
        if (res) {
          this.searchBusTemplate = res;
          this.totalItem = this.searchBusTemplate.totalItem;
          this.totalPage = this.searchBusTemplate.totalPage;
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
    const busTemplates = event as readonly BusTemplate[];
    this.searchBusTemplate.busTemplates = [...busTemplates];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusTemplate.busTemplates;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusTemplate.busTemplates.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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
