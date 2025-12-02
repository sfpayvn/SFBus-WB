import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import {
  BusLayoutTemplate,
  BusLayoutTemplate2Create,
  SearchBusLayoutTemplate,
} from './model/bus-layout-templates.model';
import { BusLayoutTemplatesService } from './service/bus-layout-templates.servive';
import { Router } from '@angular/router';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-bus-layout-templates',
  templateUrl: './bus-layout-templates.component.html',
  styleUrls: ['./bus-layout-templates.component.scss'],
  standalone: false,
})
export class BusLayoutTemplatesComponent implements OnInit {
  searchBusLayoutTemplate: SearchBusLayoutTemplate = new SearchBusLayoutTemplate();

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
    private busLayoutTemplatesService: BusLayoutTemplatesService,
    private dialog: MatDialog,
    private router: Router,
    private utils: Utils,
    public defaultFlagService: DefaultFlagService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.busLayoutTemplatesService.searchBusLayoutTemplate(this.searchParams).subscribe({
      next: (res: SearchBusLayoutTemplate) => {
        if (res) {
          this.searchBusLayoutTemplate = res;
          this.totalItem = this.searchBusLayoutTemplate.totalItem;
          this.totalPage = this.searchBusLayoutTemplate.totalPage;
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
    const busLayoutTemplates = event as readonly BusLayoutTemplate[];
    this.searchBusLayoutTemplate.busLayoutTemplates = [...busLayoutTemplates];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusLayoutTemplate.busLayoutTemplates;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusLayoutTemplate.busLayoutTemplates.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusLayoutTemplate(busLayoutTemplate: BusLayoutTemplate): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete BusLayoutTemplate',
        content:
          'Are you sure you want to delete this busTemplate? All of your data will be permanently removed. This action cannot be undone.',
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
        this.busLayoutTemplatesService.deleteBusLayoutTemplate(busLayoutTemplate._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusLayoutTemplate.busLayoutTemplates = this.searchBusLayoutTemplate.busLayoutTemplates.filter(
                (blt) => blt._id !== busLayoutTemplate._id,
              );
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
    this.router.navigateByUrl('/management/bus-management/bus-design/bus-layout-templates/bus-layout-template-detail', {
      state: params,
    });
  }

  addBusLayoutTemplate(): void {
    this.router.navigate(['/management/bus-management/bus-design/bus-layout-templates/bus-layout-template-detail']);
  }

  cloneData(busLayoutTemplate: BusLayoutTemplate): void {
    delete (busLayoutTemplate as any)._id;
    let busLayoutTemplate2Create = new BusLayoutTemplate2Create();
    busLayoutTemplate2Create = { ...busLayoutTemplate2Create, ...busLayoutTemplate };

    this.busLayoutTemplatesService.createBusLayoutTemplate(busLayoutTemplate2Create).subscribe({
      next: (res: BusLayoutTemplate) => {
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
