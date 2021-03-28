import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Role } from '../components/roles/role.model';
import { RoleResponse } from '../components/roles/role-response.model';
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
export class RoleApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }

    async getRoles(page:number = 1, size: number = 100) : Promise<RoleResponse> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/roles?page=${page}&size=${size}`)                   
            .pipe(  
                retry(2),                          
                map(data => {
                    let response = new RoleResponse();
                    response.Roles = data.data;

                    if(response.Roles !== null && response.Roles !== undefined && response.Roles.length > 0){
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
            .toPromise()
    }    

    async getRolesById(id:string) : Promise<Role> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/roles/${id}`)                   
            .pipe(  
               retry(2)
            )
            .toPromise();
    }    

    async postRole(role: Role) : Promise<void> {
        let newRole = {name:role.name, description:role.description}

        return await this.httpClient
                   .post<any>(`${this.baseUrl}/roles`, newRole, httpOptions)                   
                   .pipe(  
                          retry(2),
                          catchError((res:any) => {                     
                            let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                       
                            if(res.error && res.status === 0 ){
                                 return throwError(errorMessage);
                            }
    
                            if(res.status === 409){                            
                                return throwError('A regra de acesso já existe.');  
                            }     
                            // Parse response  
                            return throwError(res.error.message);                  
                        })
                    )
                    .toPromise();
    }    

    async updateRole(role: Role) : Promise<void> {
        let roleToUpdate = {name:role.name, description:role.description}

        return await this.httpClient
            .put<any>(`${this.baseUrl}/roles/${role.id}`, roleToUpdate, httpOptions)                   
            .pipe(  
                    retry(2),
                    catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }

                    if(res.status === 409){                            
                        return throwError('A regra de acesso já existe.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }  
    
    async deleteRole(role: Role) : Promise<void> {

        return await this.httpClient
            .delete<any>(`${this.baseUrl}/roles/${role.id}`, httpOptions)                   
            .pipe(  
                    retry(2),
                    catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    } 
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    
}