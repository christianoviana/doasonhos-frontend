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

       if(this.authService.userValue && this.authService.userValue.token) {
            let hasPermission = this.checkPermission(state.url);
                
            if(!hasPermission)
            this.router.navigate(['home']);

            return this.checkPermission(state.url);
       }                  

       this.router.navigate(['oauth/login'], { queryParams: { returnUrl:state.url }});
       return false;
    }

    checkPermission(route:string){
        switch (route.toLowerCase()) {
            case '/charities/information':
            case '/charities/information/update':                
                return  this.authService.userValue.userType.toLowerCase() == 'charitable_entity'; 
            case '/groups/create':     
            case '/groups/update':   
            case '/groups/list':                  
                return  this.authService.userValue.userType.toLowerCase() == 'administrator';        
            default:
                return true;
        }
    }
}