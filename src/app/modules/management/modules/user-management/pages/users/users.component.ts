import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { SearchUser, User } from '../../model/user.model';
import { UsersService } from '../../service/user.servive';
import { Router } from '@angular/router';

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
    filters: {
      key: '',
      value: [],
    },
  };

  totalPage: number = 0;
  totalItem: number = 0;

  isLoadingUser: boolean = false;
  indeterminate = false;
  checked = false;
  setOfCheckedId = new Set<string>();

  filterRoles = [
    { text: 'User', value: 'user' },
    { text: 'Driver', value: 'driver' },
  ];

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    public utils: Utils,
    private router: Router,
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
    this.searchParams.sortBy.key = 'role';
    this.searchParams.sortBy.value = sortValue;
    this.loadData();
  }

  filterRolesFn(filterArr: any) {
    this.searchParams.filters.key = 'role';
    this.searchParams.filters.value = filterArr;
    this.loadData();
  }

  toggleUser(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchUser.users = this.searchUser.users.map((user: User) => ({
      ...user,
      selected: checked,
    }));
  }

  deleteUser(id: string): void {
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
        this.usersService.deleteUser(id).subscribe({
          next: (res: any) => {
            if (res) {
              this.searchUser.users = this.searchUser.users.filter((user) => user._id !== id);
              toast.success('User deleted successfully');
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
}
