import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';
import { Token } from '@angular/compiler';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private toast: NgToastService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();
    const myMessage = this.auth.getMessage();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }, //BEARER MY TOKEN
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // this.toast.warning({
            //   detail: 'Warning',
            //   summary: 'Token is expired, please login again',
            // });
            // this.router.navigate(['login']);
            return this.handleUnauthorizedError(request, next);
          }
          const errorMessage = err.error.message || 'Unknown error';
          return throwError(() => new Error(errorMessage));
        }
        return throwError(() => new Error(err.message || err));
      })
    );
  }

  handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let tokenApiModel = new TokenApiModel();
    tokenApiModel.accessToken = this.auth.getToken()!;
    tokenApiModel.refreshToken = this.auth.getRefreshToken()!;
    return this.auth.renewToken(tokenApiModel).pipe(
      switchMap((data: TokenApiModel) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders: { authorization: `Bearer ${data.accessToken}` },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toast.warning({
            detail: 'Warning',
            summary: 'Token is expired, please login again',
          });
          this.router.navigate(['login']);
        });
      })
    );
  }
}
