import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSetting } from '../shared/appsetting';
import { Cep } from '../core/models/cep.model';
import { map, catchError, retry} from 'rxjs/operators'
import { throwError } from 'rxjs'

@Injectable({
    providedIn:'root'
})
export class CepApiService{    
    private readonly baseUrl = AppSetting.cepApiUrl;
    private statesDefault:Array<any> = 
    [
        {id: 12, name: "Acre", initial: "AC"},
        {id: 27, name: "Alagoas", initial: "AL"},
        {id: 16, name: "Amapá", initial: "AP"},
        {id: 13, name: "Amazonas", initial: "AM"},
        {id: 29, name: "Bahia", initial: "BA"},
        {id: 23, name: "Ceará", initial: "CE"},
        {id: 53, name: "Distrito Federal", initial: "DF"},
        {id: 32, name: "Espírito Santo", initial: "ES"},
        {id: 52, name: "Goiás", initial: "GO"},
        {id: 21, name: "Maranhão", initial: "MA"},
        {id: 51, name: "Mato Grosso", initial: "MT"},
        {id: 50, name: "Mato Grosso do Sul", initial: "MS"},
        {id: 31, name: "Minas Gerais", initial: "MG"},
        {id: 15, name: "Pará", initial: "PA"},
        {id: 25, name: "Paraíba", initial: "PB"},
        {id: 41, name: "Paraná", initial: "PR"},
        {id: 26, name: "Pernambuco", initial: "PE"},
        {id: 22, name: "Piauí", initial: "PI"},
        {id: 33, name: "Rio de Janeiro", initial: "RJ"},
        {id: 24, name: "Rio Grande do Norte", initial: "RN"},
        {id: 43, name: "Rio Grande do Sul", initial: "RS"},
        {id: 11, name: "Rondônia", initial: "RO"},
        {id: 14, name: "Roraima", initial: "RR"},
        {id: 42, name: "Santa Catarina", initial: "SC"},
        {id: 35, name: "São Paulo", initial: "SP"},
        {id: 28, name: "Sergipe", initial: "SE"},
        {id: 17, name: "Tocantins", initial: "TO"},
    ]

    constructor(private httpClient: HttpClient){
    }

    async getCep(cep:string) : Promise<Cep> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/${cep}/json`)            
            .pipe(  
                    retry(2),                          
                    map(data => {
                      const _state = this.statesDefault.find(e => e.initial == data.uf).name;
                   
                      let response = { logradouro:data.logradouro, bairro:data.bairro, localidade:data.localidade, uf:data.uf, estado:_state };
            
                      return response;
                    }),
                    catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                        console.log(res);
                        return throwError(errorMessage);                
                    })
            )
            .toPromise();
    } 
}   