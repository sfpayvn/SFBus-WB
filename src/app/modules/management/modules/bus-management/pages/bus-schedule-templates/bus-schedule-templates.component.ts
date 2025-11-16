import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { BusScheduleTemplatesService } from './service/bus-schedule-templates.servive';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import {
  BusScheduleTemplate,
  BusScheduleTemplate2Create,
  SearchBusScheduleTemplate,
} from './model/bus-schedule-template.model';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';

@Component({
  selector: 'app-bus-schedule-templates',
  templateUrl: './bus-schedule-templates.component.html',
  styleUrls: ['./bus-schedule-templates.component.scss'],
  standalone: false,
})
export class BusScheduleTemplatesComponent implements OnInit {
  searchBusScheduleTemplate: SearchBusScheduleTemplate = new SearchBusScheduleTemplate();

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
    private busScheduleTemplatesService: BusScheduleTemplatesService,
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
    this.busScheduleTemplatesService.searchBusScheduleTemplate(this.searchParams).subscribe({
      next: (res: SearchBusScheduleTemplate) => {
        if (res) {
          this.searchBusScheduleTemplate = res;
          this.totalItem = this.searchBusScheduleTemplate.totalItem;
          this.totalPage = this.searchBusScheduleTemplate.totalPage;
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
    const busScheduleTemplates = event as readonly BusScheduleTemplate[];
    this.searchBusScheduleTemplate.busScheduleTemplates = [...busScheduleTemplates];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchBusScheduleTemplate.busScheduleTemplates;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchBusScheduleTemplate.busScheduleTemplates.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteBusScheduleTemplate(busScheduleTemplate: BusScheduleTemplate): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete Bus Schedule Template',
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
        this.busScheduleTemplatesService.deleteBusScheduleTemplate(busScheduleTemplate._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchBusScheduleTemplate.busScheduleTemplates =
                this.searchBusScheduleTemplate.busScheduleTemplates.filter(
                  (bst) => bst._id !== busScheduleTemplate._id,
                );
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
    this.router.navigateByUrl(
      '/management/bus-management/bus-design/bus-schedule-templates/bus-schedule-template-detail',
      { state: params },
    );
  }

  addBusScheduleTemplate(): void {
    this.router.navigate(['/management/bus-management/bus-design/bus-schedule-templates/bus-schedule-template-detail']);
  }

  cloneData(busScheduleTemplate: BusScheduleTemplate): void {
    delete (busScheduleTemplate as any)._id;
    let busScheduleTemplate2Create = new BusScheduleTemplate2Create();
    busScheduleTemplate2Create = { ...busScheduleTemplate2Create, ...busScheduleTemplate };

    this.busScheduleTemplatesService.createBusScheduleTemplate(busScheduleTemplate2Create).subscribe({
      next: (res: BusScheduleTemplate) => {
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
