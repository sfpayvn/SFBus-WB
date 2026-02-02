import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'content-layout',
        loadChildren: () => import('./modules/content-layout/content-layout.module').then((m) => m.ContentLayoutModule),
      },
      {
        path: 'widget-block',
        loadChildren: () => import('./modules/widget-block/widget-block.module').then((m) => m.WidgetBlockModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentManagementRoutingModule {}
