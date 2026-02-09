import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Setting } from '../../model/setting.model';
import { SettingService } from '../../services/setting.service';
import { Utils } from 'src/app/shared/utils/utils';
import { DefaultSettingDetailDialogComponent } from './component/default-setting-detail-dialog/default-setting-detail-dialog.component';
import { firstValueFrom } from 'rxjs';

interface SettingUI extends Setting {
  selected: boolean;
}

interface SearchDefaultSetting {
  settings: SettingUI[];
  totalItem: number;
  totalPage: number;
}

@Component({
  selector: 'app-default-setting',
  templateUrl: './default-setting.component.html',
  styleUrls: ['./default-setting.component.scss'],
  standalone: false,
})
export class DefaultSettingComponent implements OnInit {
  searchDefaultSetting: SearchDefaultSetting = {
    settings: [],
    totalItem: 0,
    totalPage: 0,
  };

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

  constructor(private settingService: SettingService, private dialog: MatDialog, private utils: Utils) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    this.settingService.search(this.searchParams).subscribe({
      next: (searchSettings: any) => {
        if (searchSettings) {
          this.searchDefaultSetting.settings = searchSettings.settings.map((s: Setting) => ({
            ...s,
            selected: false,
          }));
          this.totalItem = searchSettings.totalItem;
          this.totalPage = Math.ceil(this.totalItem / this.searchParams.pageSize);
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
    const settings = event as readonly SettingUI[];
    this.searchDefaultSetting.settings = [...settings];
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchDefaultSetting.settings;
    this.checked = listOfEnabledData.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = listOfEnabledData.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchDefaultSetting.settings.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      this.setOfCheckedId.delete(name);
    }
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  deleteSetting(setting: Setting): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete Setting',
        content: 'Are you sure you want to delete this setting? This action cannot be undone.',
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

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          // Remove from array
          this.searchDefaultSetting.settings = this.searchDefaultSetting.settings.filter(
            (s) => s.name !== setting.name,
          );
          this.totalItem--;
          this.totalPage = Math.ceil(this.totalItem / this.searchParams.pageSize);
          toast.success('Setting deleted successfully');
        } catch (err: any) {
          this.utils.handleRequestError(err.error);
        }
      }
    });
  }

  editSetting(setting: Setting): void {
    const dialogRef = this.dialog.open(DefaultSettingDetailDialogComponent, {
      width: '700px',
      data: {
        setting: JSON.parse(JSON.stringify(setting)),
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await firstValueFrom(this.settingService.createOrUpdates([result]));
          const index = this.searchDefaultSetting.settings.findIndex((s) => s.name === result.name);
          if (index > -1) {
            this.searchDefaultSetting.settings[index] = result;
          }
          toast.success('Setting updated successfully');
        } catch (error: any) {
          this.utils.handleRequestError(error);
        }
      }
    });
  }

  addSetting(): void {
    const dialogRef = this.dialog.open(DefaultSettingDetailDialogComponent, {
      width: '700px',
      data: {
        setting: { name: '', value: '', description: '', groupName: '' },
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await firstValueFrom(this.settingService.createOrUpdates([result]));
          this.searchDefaultSetting.settings.unshift(result);
          this.totalItem++;
          this.totalPage = Math.ceil(this.totalItem / this.searchParams.pageSize);
          toast.success('Setting added successfully');
        } catch (error: any) {
          this.utils.handleRequestError(error);
        }
      }
    });
  }

  cloneData(setting: Setting): void {
    const clonedSetting = {
      ...setting,
      name: `${setting.name}_copy`,
    };

    const dialogRef = this.dialog.open(DefaultSettingDetailDialogComponent, {
      width: '700px',
      data: {
        setting: JSON.parse(JSON.stringify(clonedSetting)),
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await firstValueFrom(this.settingService.createOrUpdates([result]));
          this.searchDefaultSetting.settings.push(result);
          this.totalItem++;
          this.totalPage = Math.ceil(this.totalItem / this.searchParams.pageSize);
          toast.success('Setting cloned successfully');
        } catch (error: any) {
          this.utils.handleRequestError(error);
        }
      }
    });
  }

  sortPage(event: any): void {
    this.searchParams.sortBy = event;
    this.loadData();
  }

  searchPage(event: string): void {
    this.searchParams.keyword = event;
    this.searchParams.pageIdx = 1;
    this.loadData();
  }

  reloadPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }
}
