import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionComponent } from './pages/promotion/promotion.component';
import { PromotionDetailComponent } from './pages/promotion-detail/promotion-detail.component';

const routes: Routes = [
  {
    path: 'promotion',
    component: PromotionComponent,
  },
  {
    path: 'promotion/detail',
    component: PromotionDetailComponent,
  },
  { path: '', redirectTo: 'promotion', pathMatch: 'full' },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionManagementRoutingModule {}
