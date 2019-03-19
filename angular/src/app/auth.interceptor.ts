import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, empty, throwError } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';

import { ApiService } from '@app/api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private api: ApiService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {
    request = this._addHeader(request);
    return next.handle(request).pipe(
      catchError((res: HttpErrorResponse) => {
        if (res.status === 401) {
          return this.api.postRefreshTokens().pipe(
            flatMap(() => next.handle(
              this._addHeader(request))),
            catchError(() => {
              this.api.tokens = { access: null, refresh: null };
              this.router.navigate(['/login']);
              return throwError(res);
            }),
          );
        }
        return throwError(res);
      }),
    );
  }

  private _addHeader(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.api.tokens.access}`,
      }
    });
  }

}
