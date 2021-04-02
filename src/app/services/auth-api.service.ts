import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SocialAuthService } from "angularx-social-login";
import { TokenInfo } from '../core/token-info.model'
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../core/models/user.model';
import jwt_decode from "jwt-decode";
import { AppSetting } from '../shared/appsetting';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class AuthApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;  

    private userSubject:BehaviorSubject<User>; 
     
    get user() {
        return this.userSubject.asObservable();
    }

    get userValue() {
        return this.userSubject.value;
    }

    constructor(private httpClient: HttpClient,
                private authSocialService: SocialAuthService){                   
        this.userSubject = new BehaviorSubject<User>(this.getUserInfo());          
    }

    reloadUser(){
        this.userSubject.next(this.userValue);
    }

    authenticate(login:string, password:string) : Observable<TokenInfo> {
        return this.httpClient
                   .post<TokenInfo>(this.baseUrl +'/login/authenticate', {login, password}, httpOptions)   
                   .pipe(map(tokenInfo => {                     
                       return tokenInfo;
                    }), tap(tokenInfo => {
                        if(tokenInfo && tokenInfo.token){
                            localStorage.setItem('user', JSON.stringify(tokenInfo));
                            this.userSubject.next(this.getUserInfo());
                        }
                    }))                
                   .pipe(catchError((res:any) => {
                       this.userSubject.next(null);
                       let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                  
                       if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                       }
                       // Parse response  
                       return throwError(res.error.message);                  
                   }));
    }

    authenticateWithGoogle(id_token:string) : Observable<TokenInfo> {
        return this.httpClient
                   .post<TokenInfo>(this.baseUrl +'/login/authenticate/google', { id_token }, httpOptions)   
                   .pipe(map(tokenInfo => {                     
                       return tokenInfo;
                    }), tap(tokenInfo => {
                        if(tokenInfo && tokenInfo.token){
                            localStorage.setItem('user', JSON.stringify(tokenInfo));
                            this.userSubject.next(this.getUserInfo());
                        }
                    }))                
                   .pipe(catchError((res:any) => {
                       this.userSubject.next(null);
                       let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                  
                       if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                       }
                       // Parse response  
                       return throwError(res.error.message);                  
                   }));
    }

    getUserInfo():User{
        if(localStorage.getItem('user')){    
            let tokenInfo = JSON.parse(localStorage.getItem('user'));

            if(tokenInfo.token && tokenInfo.token.trim() !== ''){
                try {                
                    let tokenSubject =  jwt_decode(tokenInfo.token);
                    
                    let user = 
                    {  jti: tokenSubject.jti,  exp: new Date(tokenSubject.exp * 1000), iat: tokenSubject.iat, 
                        iss: tokenSubject.iss ,  ownerId: tokenSubject.owner_id , 
                        ownerName: tokenSubject.owner_name , roles: tokenSubject.role, 
                        userId: tokenSubject.sub, userName: tokenSubject.unique_name, 
                        userType: tokenSubject.user_type, token:tokenInfo.token
                    }
                    
                    if(user.exp.getTime() < new Date().getTime()){
                        console.log('token expires at ' + user.exp);
                        return null;
                    }
    
                    return user;
                } catch (error) {
                    return null;
                }
            }     
        } 
      
        return null;
    }
    
    logout(){
        if(localStorage.getItem('user')){         
            localStorage.removeItem('user');        
        }   

        try {
            this.signOutExternal();
        } catch (error) {            
        }
        
        this.userSubject.next(null);
    }

    async signOutExternal() :Promise<any>{
        if(this.userValue != null && this.userValue.userType.toLowerCase() == 'external'){
          const result = await this.authSocialService.signOut(true);
          console.log('signOut external login');

          return result;
        //   try {
        //       this.httpClient.get('https://www.google.com/accounts/Logout').subscribe(() => {
        //           console.log('Success -> Signout Google Accounts.')
        //       })
        //   } catch (error) {
        //     console.log('Error -> Signout Google Accounts.')
        //   }
        }
      }
}