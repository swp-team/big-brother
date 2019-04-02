import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '@app/login/login.component';
import { ManagerComponent } from '@app/manager/manager.component';
import { CourseComponent } from '@app/course/course.component';
import { ProjectComponent } from '@app/project/project.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ManagerComponent, children: [
    { path: 'course', redirectTo: '' },
    { path: 'course/:course', component: CourseComponent },
    { path: 'project', redirectTo: '' },
    { path: 'project/:project', component: ProjectComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
