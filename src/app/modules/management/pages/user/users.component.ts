import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { toast } from 'ngx-sonner';
import { MaterialDialogComponent } from 'src/app/shared/components/material-dialog/material-dialog.component';
import { Utils } from 'src/app/shared/utils/utils';
import { SearchUser, User } from './model/user.model';
import { UsersService } from './service/user.servive';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false
})
export class UsersComponent implements OnInit {
  searchUser: SearchUser = new SearchUser();
  selectAll: boolean = false;
  pageIdx: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalItem: number = 0;
  keyword: string = '';
  sortBy: string = '';

  isLoadingUser: boolean = false;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private utils: Utils
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoadingUser = true;
    this.usersService.searchUser(this.pageIdx, this.pageSize, this.keyword, this.sortBy).subscribe({
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

  toggleUser(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.searchUser.users = this.searchUser.users.map((user: User) => ({
      ...user,
      selected: checked,
    }));
  }

  checkSelectAll(): void {
    this.selectAll = !this.searchUser.users.some((user) => !user.selected);
  }

  deleteUser(id: string): void {
    const dialogRef = this.dialog.open(MaterialDialogComponent, {
      data: {
        icon: {
          type: 'dangerous'
        },
        title: 'Delete User',
        content:
          'Are you sure you want to delete this user? All of your data will be permanently removed. This action cannot be undone.',
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

  }

  addUser(): void {

  }

  reloadUserPage(data: any): void {
    this.pageIdx = data.pageIdx;
    this.pageSize = data.pageSize;
    this.loadData();
  }

  searchUserPage(keyword: string) {
    this.pageIdx = 1;
    this.keyword = keyword;
    this.loadData();
  }

  sortUserPage(sortBy: string) {
    this.sortBy = sortBy;
    this.loadData();
  }

  private handleRequestError(error: any): void {
    const msg = 'An error occurred while processing your request';
    toast.error(msg, {
      position: 'bottom-right',
      description: error.message || 'Please try again later',
      action: {
        label: 'Dismiss',
        onClick: () => { },
      },
      actionButtonStyle: 'background-color:#DC2626; color:white;',
    });
  }
}
