import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutDetailComponent } from './pages/content-layout-detail/content-layout-detail.component';
import { ContentLayoutComponent } from './pages/content-layout/content-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ContentLayoutComponent,
  },
  {
    path: 'detail/:id',
    component: ContentLayoutDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentLayoutRoutingModule {}
