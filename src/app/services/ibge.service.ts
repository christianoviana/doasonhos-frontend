import {Component, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSetting } from '../shared/appsetting';
import { State } from '../core/models/state.model';
import { City } from '../core/models/city.model';
import { map, catchError, retry} from 'rxjs/operators'
import { throwError } from 'rxjs'

//https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
//https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios?orderBy=nome

@Injectable({
    providedIn:'root'
})
export class IbgeApiService{    
    private readonly baseUrl = AppSetting.ibgeApiUrl;
    private statesDefault:Array<State> = 
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

    async getStates() : Promise<Array<State>> {
        return await this.httpClient
            .get<any>(`${this.baseUrl}/estados?orderBy=nome`)            
            .pipe(  
                    retry(2),                          
                    map(data => {    
                      let response = data.map(e => { return {id:e.id, name:e.nome, initial:e.sigla}});
                      return response;
                    }),
                    catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                    
                        if(res.error && res.status === 0 ){
                            console.log(errorMessage);
                        }
                        console.log(res.error.message);
        
                        return this.statesDefault;                  
                    })
            )
            .toPromise();
    } 

    async getCities(state:string) : Promise<Array<City>> {
        console.log(state);
        return await this.httpClient
            .get<any>(`${this.baseUrl}/estados/${state}/municipios?orderBy=nome`)            
            .pipe(  
                    retry(2),                          
                    map(data => {   
                        let response = data.map(e => { return {id:e.id, name:e.nome}});                        
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
}   