import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { User } from '../components/users/user.model';
import { UserResponse } from '../components/users/user-response.model';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { Pagination } from '../core/models/pagination.model';
import { AppSetting } from '../shared/appsetting';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class UserApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }

    async getUsers(page:number = 1, size: number = 100, term:string = '') : Promise<UserResponse> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/users?page=${page}&size=${size}&term=${term}`)                   
            .pipe(  
                retry(2),                          
                map(data => {
                    let response = new UserResponse();
                    response.Users = data.data;

                    if(response.Users !== null && response.Users !== undefined && response.Users.length > 0){
                        response.Pagination = new Pagination(data.pagination);                                   
                    }                              

                    return response;
                }),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                        return throwError(errorMessage);
                    }

                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    

    async getUsersById(id:string) : Promise<User> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/users/${id}`)                   
            .pipe(  
                retry(2)
            )
            .toPromise();
    }    

    async postUser(user: any) : Promise<void> {
        return await this.httpClient
            .post<any>(this.baseUrl +'/users', user)                   
            .pipe(  
                    retry(2),
                    catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }

                    if(res.status === 409){                            
                        return throwError('O usuário já existe.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    

    async updateUser(user: any) : Promise<void> {
        return await this.httpClient
            .put<any>(this.baseUrl +'/users/' + user.id, user)                   
            .pipe(  
                    retry(2),
                    catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }

                    if(res.status === 409){                            
                        return throwError('O usuário já existe.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    
}