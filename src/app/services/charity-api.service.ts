import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Charity } from '../components/charities/charity.model';
import { CharityApproval } from '../components/charities/charity-approval.model';
import { CharityResponse } from '../components/charities/charity-response.model';
import { Observable, throwError } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { Pagination } from '../core/models/pagination.model';
import { PendingCharities } from '../components/pendings/pending-approve/pending-charities.model';
import { AppSetting } from '../shared/appsetting';
import { CharityStatus } from '../components/pendings/pending-detail/charity-status.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class CharityApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }

    async getCharities(page:number = 1, size: number = 100, search:string = '') : Promise<CharityResponse> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/charities?page=${page}&size=${size}&term=${search}`)            
            .pipe(  
                    retry(2),                          
                    map(data => {                        
                        let response = new CharityResponse();

                        if(data.data == undefined){
                            console.log('No Charities');
                        }else{
                            response.Charities = data.data;
                            response.Pagination = data.pagination;
    
                            if(response.Pagination !== undefined && response.Charities.length > 0){
                                response.Pagination = new Pagination(data.pagination);                                  
                            }      
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

    async getCharitiesById(id:string) : Promise<Charity> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/charities/${id}`)                   
            .pipe(  
                retry(2)
            )
            .toPromise();
    } 
    
    async getCharityApproval(id:string) : Promise<Array<CharityApproval>> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/charities/${id}/approval`)                   
            .pipe(  
                retry(2)
            )
            .toPromise();
    }  


    async getCharityStatus(cnpj:string) : Promise<CharityStatus> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/charities/status?cnpj=${cnpj}`)                   
            .pipe(  
                retry(1)
            )
            .toPromise();
    }  

    async getCharityPendingsByState() : Promise<Array<PendingCharities>> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/charities/pending`)                   
            .pipe(  
                retry(1)
            )
            .toPromise();
    }  
    
    async postCharity(charity: any) : Promise<void> {

        return await this.httpClient
            .post<any>(`${this.baseUrl}/charities`, charity , httpOptions)                   
            .pipe(  
                retry(2),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }

                    console.log(res.error);
                       
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    

    async putCharityPeding(id:string, charityApprove: any) : Promise<void> {

        return await this.httpClient
            .put<any>(`${this.baseUrl}/charities/${id}/pending`, charityApprove , httpOptions)                   
            .pipe(  
                retry(2),
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }

                    console.log(res.error);
                       
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }    


}