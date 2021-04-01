import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { DonorPF } from '../components/register/donor-pf.model';
import { DonorPJ } from '../components/register/donor-pj.model';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AppSetting } from '../shared/appsetting';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn:'root'
})
export class RegisterApiService{    
    private readonly baseUrl = AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }
   
    async postDonorPF(donorPf: DonorPF) : Promise<void> {
       
        return await this.httpClient
            .post<any>(`${this.baseUrl}/donorspf`, donorPf , httpOptions)                   
            .pipe(  
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    console.log(res);
                    
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }
    
                    if(res.status === 409){                            
                        return throwError('O doador já possui cadastro.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }   
    
    async postDonorPJ(donorPj: DonorPJ) : Promise<void> {
       
        return await this.httpClient
            .post<any>(`${this.baseUrl}/donorspj`, donorPj , httpOptions)                   
            .pipe(  
                catchError((res:any) => {                     
                    let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                
                    if(res.error && res.status === 0 ){
                            return throwError(errorMessage);
                    }
    
                    if(res.status === 409){                            
                        return throwError('O doador já possui cadastro.');  
                    }     
                    // Parse response  
                    return throwError(res.error.message);                  
                })
            )
            .toPromise();
    }

    
    async putDonorPF(donorPf: any, id:string) : Promise<void> {
       
        return await this.httpClient
            .put<any>(`${this.baseUrl}/donorspf/${id}`, donorPf , httpOptions)                   
            .pipe(  
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

    async putDonorPJ(donorPj: any, id:string) : Promise<void> {
       
        return await this.httpClient
            .put<any>(`${this.baseUrl}/donorspj/${id}`, donorPj , httpOptions)                   
            .pipe(  
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

    async getDonorPF(id: string) : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/donorspf/${id}`)                   
            .pipe(  
                retry(1),
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

    async getDonorPJ(id: string) : Promise<any> {
       
        return await this.httpClient
            .get<any>(`${this.baseUrl}/donorspj/${id}`)                   
            .pipe(  
                retry(1),
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