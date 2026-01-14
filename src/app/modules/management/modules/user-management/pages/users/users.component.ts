import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { SearchUser, User } from '../../model/user.model';
import { Router } from '@angular/router';
import { DriversService } from '../../service/driver.servive';
import { ROLE_CLASSES, ROLE_CONSTANTS, ROLE_LABELS } from '@rsApp/core/constants/roles.constants';
import { UserManagementService } from '../../service/user.servive';
import { FUNCTION_KEYS, MODULE_KEYS } from '@rsApp/core/constants/module-function-keys';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false,
})
export class UsersComponent implements OnInit {
  searchUser: SearchUser = new SearchUser();

  searchParams = {
    pageIdx: 1,
    startDate: '' as Date | '',
    endDate: '' as Date | '',
    pageSize: 5,
    keyword: '',
    sortBy: {
      key: 'createdAt',
      value: 'descend',
    },
    filters: [] as { key: string; value: any }[],
  };

  totalPage: number = 0;
  totalItem: number = 0;

  isLoadingUser: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  roleClasses: Record<string, string> = ROLE_CLASSES;

  capModule: string = MODULE_KEYS.USER_CLIENT;
  capFunction: string = FUNCTION_KEYS.USER_CLIENT.CREATE;

  userRole: string = ROLE_CONSTANTS.CLIENT;
  userRoleLabel = ROLE_LABELS;

  constructor(
    private dialog: MatDialog,
    public utils: Utils,
    private router: Router,
    private driversService: DriversService,
    private userManagementService: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.initializeUserRole();
    this.loadData();
  }

  private initializeUserRole(): void {
    switch (this.router.url) {
      case '/management/users-management/users':
        this.userRole = ROLE_CONSTANTS.CLIENT;
        this.capModule = MODULE_KEYS.USER_CLIENT;
        this.capFunction = FUNCTION_KEYS.USER_CLIENT.CREATE;
        break;
      case '/management/users-management/driver':
        this.userRole = ROLE_CONSTANTS.DRIVER;
        this.capModule = MODULE_KEYS.USER_DRIVER;
        this.capFunction = FUNCTION_KEYS.USER_DRIVER.CREATE;
        break;
      case '/management/users-management/pos':
        this.userRole = ROLE_CONSTANTS.POS;
        this.capModule = MODULE_KEYS.USER_POS;
        this.capFunction = FUNCTION_KEYS.USER_POS.CREATE;
        break;
      case '/management/users-management/tenant':
        this.userRole = ROLE_CONSTANTS.TENANT;
        this.capModule = MODULE_KEYS.USER_TENANT;
        this.capFunction = FUNCTION_KEYS.USER_TENANT.CREATE;
        break;
      case '/management/users-management/tenant-operator':
        this.userRole = ROLE_CONSTANTS.TENANT_OPERATOR;
        this.capModule = MODULE_KEYS.USER_TENANT_OPERATOR;
        this.capFunction = FUNCTION_KEYS.USER_TENANT_OPERATOR.CREATE;
        break;
      default:
        this.userRole = ROLE_CONSTANTS.CLIENT;
        break;
    }
  }

  loadData(): void {
    this.isLoadingUser = true;
    this.userManagementService.searchUser(this.userRole, this.searchParams).subscribe({
      next: (res: SearchUser) => {
        if (res) {
          this.searchUser = res;
          this.totalItem = this.searchUser.totalItem;
          this.totalPage = this.searchUser.totalPage;
        }
        this.isLoadingUser = false;
      },
      error: (error: any) => {
        this.utils.handleRequestError(error);
        this.isLoadingUser = false;
      },
    });
  }

  // sortRoleFn(sortValue: any) {
  //   this.searchParams.sortBy.key = 'roles';
  //   this.searchParams.sortBy.value = sortValue;
  //   this.loadData();
  // }

  // filterRolesFn(filterArr: any) {
  //   if (filterArr.length === 0) {
  //     // Xóa filter roles nếu không có giá trị nào được chọn
  //     this.searchParams.filters = this.searchParams.filters.filter((f) => f.key !== 'roles');
  //     this.loadData();
  //     return;
  //   }

  //   this.addOrReplaceFilters({ key: 'roles', value: filterArr });
  //   this.loadData();
  // }

  toggleUser(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchUser.users = this.searchUser.users.map((user: User) => ({
      ...user,
      selected: checked,
    }));
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous',
        },
        title: 'Delete User',
        content:
          'Are you sure you want to delete this user? All of your data will be permanently removed. This action cannot be undone.',
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
        this.userManagementService.deleteUser(this.userRole, user._id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchUser.users = this.searchUser.users.filter((u) => u._id !== user._id);
              toast.success('User deleted successfully');
              if (user.roles.includes('driver')) {
                this.driversService.deleteDriverByUser(user._id).subscribe();
              }
            }
          },
          error: (error: any) => this.utils.handleRequestError(error),
        });
      }
    });
  }

  editUser(user: User): void {
    const params = { user: JSON.stringify(user), userRole: this.userRole };
    this.router.navigateByUrl('/management/users-management/users/detail', { state: params });
  }

  addUser(): void {
    const params = { userRole: this.userRole };
    this.router.navigate(['/management/users-management/users/detail'], { state: params });
  }

  reloadUserPage(data: any): void {
    this.searchParams = {
      ...this.searchParams,
      ...data,
    };
    this.loadData();
  }

  searchUserPage(keyword: string) {
    this.searchParams = {
      ...this.searchParams,
      pageIdx: 1,
      keyword,
    };
    this.loadData();
  }

  sortUserPage(sortBy: { key: string; value: string }) {
    this.searchParams = {
      ...this.searchParams,
      sortBy,
    };
    this.loadData();
  }

  onCurrentPageDataChange(users: readonly User[]): void {
    this.searchUser.users = users;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.searchUser.users;
    this.checked = listOfEnabledData.every(({ _id }) => this.setOfCheckedId.has(_id));
    this.indeterminate = listOfEnabledData.some(({ _id }) => this.setOfCheckedId.has(_id)) && !this.checked;
  }

  onAllChecked(checked: boolean): void {
    this.searchUser.users.forEach(({ _id }) => this.updateCheckedSet(_id, checked));
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

  addOrReplaceFilters(newItem: { key: string; value: any }): void {
    const idx = this.searchParams.filters.findIndex((i) => i.key === newItem.key && i.value === newItem.value);

    if (idx > -1) {
      // Thay thế phần tử cũ
      this.searchParams.filters[idx] = newItem;
    } else {
      // Thêm mới
      this.searchParams.filters.push(newItem);
    }
  }
}
