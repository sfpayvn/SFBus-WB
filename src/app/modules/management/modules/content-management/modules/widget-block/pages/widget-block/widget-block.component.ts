import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { Router } from '@angular/router';
import { DefaultFlagService } from '@rsApp/shared/services/default-flag.service';
import { WidgetBlockService } from '../../service/widget-block.servive';
import { SearchWidgetBlock, WidgetBlock, WidgetBlock2Create } from '../../model/widget-block.model';
import { UtilsModal } from '@rsApp/shared/utils/utils-modal';

@Component({
  selector: 'app-widget-block',
  templateUrl: './widget-block.component.html',
  styleUrls: ['./widget-block.component.scss'],
  standalone: false,
})
export class WidgetBlockComponent implements OnInit {
  searchWidgetBlock: SearchWidgetBlock = new SearchWidgetBlock();

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
    private widgetBlockService: WidgetBlockService,
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
    this.widgetBlockService.searchWidgetBlock(this.searchParams).subscribe({
      next: (res: SearchWidgetBlock) => {
        if (res) {
          this.searchWidgetBlock = res;
          this.totalItem = this.searchWidgetBlock.totalItem;
          this.totalPage = this.searchWidgetBlock.totalPage;
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
    const widgetBlocks = event as readonly WidgetBlock[];
    this.searchWidgetBlock.widgetBlocks = [...widgetBlocks];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchWidgetBlock.widgetBlocks;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchWidgetBlock.widgetBlocks.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  deleteWidgetBlock(widgetBlock: WidgetBlock): void {
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
        this.widgetBlockService.deleteWidgetBlock(widgetBlock._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchWidgetBlock.widgetBlocks = this.searchWidgetBlock.widgetBlocks.filter(
                (bt: WidgetBlock) => bt._id !== widgetBlock._id,
              );
              toast.success('Bus deleted successfully');
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  goToWidgetBlockDetail(widgetBlock: WidgetBlock | null): void {
    if (widgetBlock?._id) {
      // Edit mode - navigate to detail page with ID
      this.router.navigate(['/management/content-management/widget-block/detail', widgetBlock._id], {
        state: { widgetBlock: JSON.stringify(widgetBlock) },
      });
    } else {
      // Create mode - navigate to detail page
      this.router.navigate(['/management/content-management/widget-block/detail', 'new']);
    }
  }

  cloneData(widgetBlock: WidgetBlock): void {
    delete (widgetBlock as any)._id;
    let widgetBlockCreate = new WidgetBlock2Create();
    widgetBlockCreate = { ...widgetBlockCreate, ...widgetBlock };

    this.widgetBlockService.createWidgetBlock(widgetBlockCreate).subscribe({
      next: (res: WidgetBlock) => {
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

  viewImage($event: any, image: string): void {
    $event.stopPropagation();
    this.utilsModal.viewImage($event, image);
  }
}
