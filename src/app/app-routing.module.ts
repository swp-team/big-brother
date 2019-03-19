import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityComponent } from '@app/activity/activity.component';
import { LoginComponent } from '@app/login/login.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/activities' },
  { path: 'login', component: LoginComponent },
  { path: 'activities', component: ActivityComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
