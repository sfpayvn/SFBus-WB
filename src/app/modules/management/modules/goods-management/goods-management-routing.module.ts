import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsComponent } from './pages/goods/goods.component';
import { GoodsDetailComponent } from './pages/goods-detail/goods-detail.component';
import { GoodsCategoriesComponent } from './pages/goods-categories/goods-categories.component';

const routes: Routes = [
  {
    path: 'goods',
    component: GoodsComponent,
  },
  {
    path: 'goods/detail',
    component: GoodsDetailComponent,
  },
  {
    path: 'goods-categories',
    component: GoodsCategoriesComponent,
  },
  { path: '**', redirectTo: 'errors/404' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsManagementRoutingModule { }
