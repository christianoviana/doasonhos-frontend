import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    constructor(private authService:AuthApiService, private router:Router){
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

       if(this.authService.userValue && this.authService.userValue.token)                      
          return true;

       this.router.navigate(['oauth/login'], { queryParams: { returnUrl:state.url }});
       return false;
    }
}