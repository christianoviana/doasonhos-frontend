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
                retry(2),
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
    
    async postDonorPJ(donorPj: DonorPJ) : Promise<void> {
       
        return await this.httpClient
            .post<any>(`${this.baseUrl}/donorspj`, donorPj , httpOptions)                   
            .pipe(  
                retry(2),
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
}