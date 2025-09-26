import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscriptionDetailComponent } from './pages/subscription-detail/subscription-detail.component';

const routes: Routes = [
  {
    path: 'subscription',
    component: SubscriptionComponent,
  },
  {
    path: 'subscription-detail',
    component: SubscriptionDetailComponent,
  },
  { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
  { path: '**', redirectTo: 'errors/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionManagementRoutingModule {}
