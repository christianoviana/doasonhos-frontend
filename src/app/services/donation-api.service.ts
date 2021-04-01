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
export class DonationApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }
   
    async postDonationOnline(donation:any) : Promise<void> {
       
        return await this.httpClient
            .post<any>(`${this.baseUrl}/donations/online`, donation , httpOptions)                   
            .pipe(  
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
    
    async postDonationPresencial(donation:any) : Promise<void> {
       
        return await this.httpClient
            .post<any>(`${this.baseUrl}/donations/presential`, donation , httpOptions)                   
            .pipe(  
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
    
    async CancelDonationPresencial(id:string) : Promise<void> {
       
        return await this.httpClient
            .put<any>(`${this.baseUrl}/donations/${id}/cancel`, httpOptions)                   
            .pipe(  
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

    async ApproveDonationPresencial(id:string) : Promise<void> {
       
        return await this.httpClient
            .put<any>(`${this.baseUrl}/donations/${id}/approve`, httpOptions)                   
            .pipe(  
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
    
    
    
    async getCharitiesDonation(id:string, page:number = 1, size: number = 100) : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/donations/charities/${id}?page=${page}&size=${size}`, httpOptions)                   
            .pipe(  
                retry(1),
                map(data => {
                    let response:any = {};
                    response.Donations = data.data;

                    if(response.Donations !== null && response.Donations !== undefined && response.Donations.length > 0){
                        response.Pagination = new Pagination(data.pagination);                                  
                    }                              

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

    async getDonorsDonation(id:string, page:number = 1, size: number = 100) : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/donations/donors/${id}?page=${page}&size=${size}`, httpOptions)                   
            .pipe(  
                retry(1),
                map(data => {
                    let response:any = {};
                    response.Donations = data.data;

                    if(response.Donations !== null && response.Donations !== undefined && response.Donations.length > 0){
                        response.Pagination = new Pagination(data.pagination);                                  
                    }                              

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