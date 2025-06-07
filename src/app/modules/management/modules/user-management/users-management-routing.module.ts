import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
  {
    path: 'users/detail',
    component: UserDetailComponent,
  },
  { path: '**', redirectTo: 'errors/404' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersManagementRoutingModule { }
