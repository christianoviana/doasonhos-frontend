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
    private readonly baseUrl = 'http://localhost:5000/api/v1';

    constructor(private httpClient: HttpClient){
    }

    getItems(page:number = 1, size: number = 100) : Observable<ItemResponse> {
        return this.httpClient
                   .get<any>(this.baseUrl + '/items?page=' + page + '&' + 'size=' + size)                   
                   .pipe(  
                            retry(2),                          
                            map(data => {
                                let response = new ItemResponse();
                                response.Items = data.data;

                                if(response.Items !== undefined && response.Items.length > 0){
                                    response.Pagination = new Pagination(data.pagination);                                  
                                }                              

                                return response;
                            })
                    ).pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }

                        return throwError(res.error.message);                  
                    }));
    }    

    getItemById(id:string) : Observable<Item> {
        return this.httpClient
                   .get<any>(this.baseUrl +'/items/' + id)                   
                   .pipe(  
                            retry(2)
                    );
    }  
    
    postItem(item: any) : Observable<void> {
        return this.httpClient
                   .post<any>(this.baseUrl +'/items', item)                   
                   .pipe(  
                          retry(2)
                    )
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
        const itemToUpdate = { name:item.name, description:item.description, price:item.price, group_id:item.group.id }
        return this.httpClient
                   .put<any>(this.baseUrl +'/items/'+item.id, itemToUpdate)                   
                   .pipe(  
                          retry(2)
                    )
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
                   .pipe(  
                          retry(2)
                    )
                    .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                   
                        if(res.error && res.status === 0 ){
                             return throwError(errorMessage);
                        }
                           
                        // Parse response  
                        return throwError(res.error.message);                  
                    }));
    } 
    
    deleteItem(item: any) : Observable<void> {
        return this.httpClient
                    .delete<any>(this.baseUrl +'/items/'+item.id)                   
                    .pipe(  
                            retry(2)
                    )
                    .pipe(catchError((res:any) => {                     
                        let errorMessage = 'Erro ao processar a sua solicitação. Por favor tente novamente em alguns instantes';
                    
                        if(res.error && res.status === 0 ){
                                return throwError(errorMessage);
                        } 
                        // Parse response  
                        return throwError(res.error.message);                  
                    }));
    } 
}