import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetBlockDetailComponent } from './pages/widget-block-detail/widget-block-detail.component';
import { WidgetBlockComponent } from './pages/widget-block/widget-block.component';

const routes: Routes = [
  {
    path: '',
    component: WidgetBlockComponent,
  },
  {
    path: 'detail/:id',
    component: WidgetBlockDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WidgetBlockRoutingModule {}
