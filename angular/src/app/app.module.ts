import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatCardModule, MatRippleModule, MatInputModule, MatSelectModule, MatDialogModule, MatBadgeModule, MatTableModule } from '@angular/material';

import { AppRoutingModule } from '@app/app-routing.module';

import { ApiService } from '@app/api.service';
import { AuthInterceptor } from '@app/auth.interceptor';

import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { CourseComponent } from './course/course.component';
import { ProjectComponent } from './project/project.component';
import { ProjectEditDialogComponent } from './project-edit-dialog/project-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManagerComponent,
    CourseComponent,
    ProjectComponent,
    ProjectEditDialogComponent,
  ],
  entryComponents: [
    ProjectEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,

    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatRippleModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatBadgeModule,
    MatTableModule,

    AppRoutingModule,
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
