import {Component, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Item } from '../components/items/item.model';
import { ItemResponse } from '../components/items/item-response.model';
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
export class ItemApiService{    
    private readonly baseUrl =  AppSetting.apiBaseUrl;

    constructor(private httpClient: HttpClient){
    }

    getItems(page:number = 1, size: number = 100, term='') : Promise<ItemResponse> {
        return this.httpClient
                   .get<any>(`${this.baseUrl}/items?page=${page}&size=${size}&Term=${term}`)                   
                   .pipe(  
                            retry(1),                          
                            map(data => {
                                console.log(data);
                                
                                let response = new ItemResponse();
                                response.Items = data.data;
                            
                                if(response.Items != null && response.Items !== undefined && response.Items.length > 0){
                                    response.Pagination = new Pagination(data.pagination);                                  
                                }                              

                                return response;
                            })
                    ).pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }

                        console.log(res);
                        return throwError(res.error.message);                  
                    })).toPromise();
    }    

    getItemById(id:string) : Observable<Item> {
        return this.httpClient
                   .get<any>(this.baseUrl +'/items/' + id)                   
                   .pipe(  
                            retry(1)
                    );
    }  
    
    postItem(item: any) : Observable<void> {
               
        return this.httpClient
                   .post<any>(this.baseUrl +'/items', item) 
                    .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }

                        if(res.status === 409){                            
                            return throwError('O item já existe.');  
                        }     
                        // Parse response  
                        return throwError(res.error.message);                  
                    }));
    }    

    updateItem(item: any) : Observable<void> {
        const itemToUpdate = { name:item.name, description:item.description, price:item.price.replace(',', '.'), group_id:item.group.id, activated:item.activated }

        console.log(itemToUpdate);

        return this.httpClient
                   .put<any>(this.baseUrl +'/items/'+item.id, itemToUpdate)                                      
                   .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }

                        if(res.status === 409){                            
                            return throwError('O item já existe.');  
                        }     
                        // Parse response  
                        return throwError(res.error.message);                  
                    }));
    }    

    updateItemImage(itemId:string, data:any) : Observable<void> {
        return this.httpClient
                   .put<any>(this.baseUrl +'/items/'+ itemId + '/image', data)                   
                   .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }
                           
                        // Parse response  
                        return throwError(res.error.message);                  
                    }));
    } 
    
    deleteItem(item: any) : Promise<void> {
        return this.httpClient
                    .delete<any>(this.baseUrl +'/items/'+item.id)                   
                    .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                    
                        if(res.error && res.status === 0 ){
                                return throwError(errorMessage);
                        } 
                        // Parse response  
                        return throwError(res.error.message);                  
                    })).toPromise();
    } 
}