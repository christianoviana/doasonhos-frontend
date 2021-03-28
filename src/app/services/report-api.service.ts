import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { AppSetting } from '../shared/appsetting';
import { Pagination } from '../core/models/pagination.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class ReportApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }
   
    async getCharities(id:string, beginDate, finalDate) : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/reports/charities/${id}?from=${beginDate}&to=${finalDate}`, httpOptions)                   
            .pipe(  
                retry(2),
                map(data => {
                    let response:any = data;                         

                    return response;
                }),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    console.log(res);
                    
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }  
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }  
    
    async getUsers() : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/reports/users`, httpOptions)                   
            .pipe(  
                retry(2),
                map(data => {
                    let response:any = data;                         

                    return response;
                }),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    console.log(res);
                    
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