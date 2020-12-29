import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSetting } from '../shared/appsetting';

import { AuthApiService } from '../services/auth-api.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService:AuthApiService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authService.userValue;
        let isCharityApiUrl =request.url.toLowerCase().includes(AppSetting.apiBaseUrl.toLowerCase());

        if (currentUser && currentUser.token && isCharityApiUrl) {
            console.log('jwt Interceptor add toking to request. ' + request.urlWithParams);
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}