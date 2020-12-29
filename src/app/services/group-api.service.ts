import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Group } from '../components/groups/group.model';
import { GroupResponse } from '../components/groups/group-response.model';
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
export class GroupApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }

    async getGroups(page:number = 1, size: number = 100) : Promise<GroupResponse> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/groups?page=${page}&size=${size}`)            
            .pipe(  
                    retry(2),                          
                    map(data => {
                        let response = new GroupResponse();
                        response.Groups = data.data;

                        if(response.Groups !== undefined && response.Groups.length > 0){
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

    async getGroupsById(id:string) : Promise<Group> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/groups/${id}`)                   
            .pipe(  
                retry(2)
            )
            .toPromise();
    }    

    async getGroupsItems() : Promise<any> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/groups/items`)                   
            .pipe(  
                retry(2)
            )
            .toPromise();
    }    

    async postGroup(group: Group) : Promise<void> {
        const newGroup =  {name:group.name, description:group.description};

        return await this.httpClient
            .post<any>(`${this.baseUrl}/groups`, newGroup , httpOptions)                   
            .pipe(  
                retry(2),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }
    
                    if(res.status === 409){                            
                        return throwError('O grupo já existe.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    

    async updateGroup(group: Group) : Promise<void> {        
        const groupToUpdate =  { name:group.name, description:group.description };

        return await this.httpClient
            .put<any>(`${this.baseUrl}/groups/${group.id}`,groupToUpdate, httpOptions)                   
            .pipe(  
                retry(2),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }
    
                    if(res.status === 409){                            
                        return throwError('O grupo já existe.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    
}