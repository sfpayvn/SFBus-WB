import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { SearchUser, User } from '../../model/user.model';
import { UsersService } from '../../service/user.servive';
import { Router } from '@angular/router';
import { DriversService } from '../../service/driver.servive';

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

  filterRoleSelected = [] as string[];

  filterRoles = [
    { text: 'Client', value: 'client' },
    { text: 'Driver', value: 'driver' },
    { text: 'Pos', value: 'pos' },
    { text: 'Tenant', value: 'tenant' },
  ];

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    public utils: Utils,
    private router: Router,
    private driversService: DriversService,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingUser = true;
    this.usersService.searchUser(this.searchParams).subscribe({
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

  sortRoleFn(sortValue: any) {
    this.searchParams.sortBy.key = 'roles';
    this.searchParams.sortBy.value = sortValue;
    this.loadData();
  }

  filterRolesFn(filterArr: any) {
    if (filterArr.length === 0) {
      // Xóa filter roles nếu không có giá trị nào được chọn
      this.searchParams.filters = this.searchParams.filters.filter((f) => f.key !== 'roles');
      this.loadData();
      return;
    }

    this.addOrReplaceFilters({ key: 'roles', value: filterArr });
    this.loadData();
  }

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
        this.usersService.deleteUser(user._id).subscribe({
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
    const params = { user: JSON.stringify(user) };
    this.router.navigateByUrl('/management/users-management/users/detail', { state: params });
  }

  addUser(): void {
    this.router.navigate(['/management/users-management/users/detail']);
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
