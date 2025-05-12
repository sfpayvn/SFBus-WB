import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management.component';
import { FilesComponent } from './pages/files-center/files-center.component';
import { UsersComponent } from './pages/user/users.component';
import { UserDetailComponent } from './pages/user/pages/user-detail/user-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/user-detail',
        component: UserDetailComponent,
      },
      {
        path: 'media-center',
        component: FilesComponent,
      },
      { path: '**', redirectTo: 'errors/404' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule { }
