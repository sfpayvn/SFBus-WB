import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { ContentLayout, ContentLayout2Create, SearchContentLayout } from '../../model/content-layout.model';
import { ContentLayoutService } from '../../service/content-layout.servive';
import {
  APP_SOURCE_LABELS,
  PLATFORM_DEFAULT_APP_SOURCE,
  PLATFORM_DEFAULT_APP_SOURCE_LABELS,
} from '@rsApp/core/constants/app-source.constant';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  standalone: false,
})
export class ContentLayoutComponent implements OnInit {
  searchContentLayout: SearchContentLayout = new SearchContentLayout();

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

  appSourcesLabels = APP_SOURCE_LABELS;

  platformLabels = PLATFORM_DEFAULT_APP_SOURCE_LABELS;

  constructor(
    private contentLayoutService: ContentLayoutService,
    private dialog: MatDialog,
    private utils: Utils,
    private router: Router,
    public defaultFlagService: DefaultFlagService,
    private utilsModal: UtilsModal,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.contentLayoutService.searchContentLayout(this.searchParams).subscribe({
      next: (res: SearchContentLayout) => {
        if (res) {
          this.searchContentLayout = res;
          this.totalItem = this.searchContentLayout.totalItem;
          this.totalPage = this.searchContentLayout.totalPage;
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
    const contentLayouts = event as readonly ContentLayout[];
    this.searchContentLayout.contentLayouts = [...contentLayouts];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchContentLayout.contentLayouts;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchContentLayout.contentLayouts.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteContentLayout(contentLayout: ContentLayout): void {
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
        this.contentLayoutService.deleteContentLayout(contentLayout._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchContentLayout.contentLayouts = this.searchContentLayout.contentLayouts.filter(
                (cl: ContentLayout) => cl._id !== contentLayout._id,
              );
              toast.success('Content layout deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  goToContentLayoutDetail(contentLayout: ContentLayout | null): void {
    if (contentLayout?._id) {
      // Edit mode - navigate to detail page with ID
      this.router.navigate(['/management/content-management/content-layout/detail', contentLayout._id], {
        state: { contentLayout: JSON.stringify(contentLayout) },
      });
    } else {
      // Create mode - navigate to detail page
      this.router.navigate(['/management/content-management/content-layout/detail', 'new']);
    }
  }

  cloneData(contentLayout: ContentLayout): void {
    delete (contentLayout as any)._id;
    let contentLayoutCreate = new ContentLayout2Create();
    contentLayoutCreate = { ...contentLayoutCreate, ...contentLayout, zones: JSON.stringify(contentLayout.zones) };

    this.contentLayoutService.createContentLayout(contentLayoutCreate).subscribe({
      next: (res: ContentLayout) => {
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

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
