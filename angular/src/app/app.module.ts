import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from '@app/app-routing.module';

import { ApiService } from '@app/api.service';
import { AuthInterceptor } from '@app/auth.interceptor';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,

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
