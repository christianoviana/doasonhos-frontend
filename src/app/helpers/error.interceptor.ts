import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthApiService } from '../services/auth-api.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService:AuthApiService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401 && this.authService.userValue != undefined) {
                console.log('auto logout if 401 response returned from api');
                // auto logout if 401 response returned from api
                this.authService.logout();
                this.router.navigate(['oauth/login']);
                //location.reload(true);
            }
            return throwError(err);
        }))
    }
}