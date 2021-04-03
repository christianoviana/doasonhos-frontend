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
            case '/charities/create':
            case '/charities/update':
            case '/charities/item':
            case '/charities/donation':
            case '/charities/information/update':                
            case '/charities/information/create':                
                return  this.authService.userValue.userType.toLowerCase() == 'charitable_entity'; 
            case '/donors/donation':                
                return  this.authService.userValue.userType.toLowerCase() == 'donor_pf' || 
                        this.authService.userValue.userType.toLowerCase() == 'donor_pj' ||
                        this.authService.userValue.userType.toLowerCase() == 'external';
            case '/donors/update-pf': 
                return  this.authService.userValue.userType.toLowerCase() == 'donor_pf';             
            case '/donors/update-pj':                
                return this.authService.userValue.userType.toLowerCase() == 'donor_pj'; 
            case '/groups/create':     
            case '/groups/update':   
            case '/groups/list':   
            case '/items/create':     
            case '/items/update':   
            case '/items/list':   
            case '/roles/create':     
            case '/roles/update':   
            case '/roles/list':    
            case '/users/create':   
            case '/users/list':                   
                return  this.authService.userValue.userType.toLowerCase() == 'administrator';    
            case '/pendings/approve':                
                return  this.authService.userValue.userType.toLowerCase() == 'administrator' ||
                        this.authService.userValue.userType.toLowerCase() == 'manager';  
            case '/donations/payment':                
            return  this.authService.userValue.userType.toLowerCase() == 'donor_pf' || 
                    this.authService.userValue.userType.toLowerCase() == 'donor_pj' ||
                    this.authService.userValue.userType.toLowerCase() == 'external';                              
            default:
                return true;
        }
    }
}