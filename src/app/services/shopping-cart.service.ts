import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {CartItem} from '../core/models/cart-item.model';
import { Item } from '../components/items/item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
    private items:BehaviorSubject<Array<CartItem>>;    
    maxItems = 99;
    entityId = '';

    constructor(){
        this.items = new BehaviorSubject<Array<CartItem>>([]);
    }

    getCharityEntityFromSession():string{
        if(sessionStorage.getItem('entity_id')){
            return sessionStorage.getItem('entity_id');
        }else{
            return '';
        }
    }

    itemsValue(){
        return this.items.value;
    }

    itemsObservable(){
        return this.items.asObservable();
    }

    clear(){
        this.setSessionStorage(null, true);
        this.items.next([]);        
    }

    total():number{
        return this.items.value.map(item => item.getTotal()).reduce((prev, current) => prev + current, 0);
    }

    totalItems():number{
        return this.items.value.map(item => item.getQuantity()).reduce((prev, current) => prev + current, 0);
    }

    add(menuItem:Item, entityId:string){
        const cartItem = this.items.value.find(item => item.getItemId()==  menuItem.id);

        if(cartItem){
            if(cartItem.getQuantity() < this.maxItems){
                cartItem.increment();
                this.items.next(this.items.value);
            }
              
        }else{
            let newArrayValue: Array<CartItem> = this.items.value;
            newArrayValue.push(new CartItem(menuItem, 1));

            this.items.next(newArrayValue);
        }
        this.setSessionStorage(entityId);
    }
    
    remove(menuItem:Item, entityId:string){
        const cartItem = this.items.value.find(item => item.getItemId() == menuItem.id);

        if(cartItem){
            if(cartItem.getQuantity() > 1){
                cartItem.decrease();
                this.items.next(this.items.value);
                this.setSessionStorage(entityId);
            }         
            else
                this.removeFromCart(cartItem.getItem(), entityId);
        }
    }

    addToCart(_item:Item, entityId:string){
        const cartItem = this.items.value.find(item => item.getItemId()==  _item.id);

        if(cartItem == undefined){
            let newArrayValue: Array<CartItem> = this.items.value;
            newArrayValue.push(new CartItem(_item, 1));

            this.items.next(newArrayValue);            
            this.setSessionStorage(entityId);
        }
    }

    addCartItemsFromSession(cartItems:Array<any>){
        let newArrayValue: Array<CartItem> = [];

        cartItems.forEach(ci => {
            newArrayValue.push(new CartItem(ci.item, ci.quantity));
        });   

        this.items.next(newArrayValue);  
    }

    addCartItems(cartItems:Array<CartItem>, entityId:string){      
        this.items.next(cartItems);         
        this.setSessionStorage(entityId);     
    }

    removeFromCart(_item:Item, entityId:string){
        this.items.next(this.items.value.filter(item => item.getItemId() != _item.id));    
        
        if(this.items.value == undefined || this.items.value == [] || this.items.value.length == 0)
            this.clear();
        else        
            this.setSessionStorage(entityId);
    }

    setSessionStorage(entityId:string, removeSession:boolean = false){
        if(!removeSession){
            let cartItemsToSessionStorage:Array<any> = this.items.getValue().map(ci => {
                return {item:ci.getItem(), quantity:ci.getQuantity() }
              });
                            
              sessionStorage.removeItem('entity_id');
              sessionStorage.removeItem('cart_items');
              
              sessionStorage.setItem('entity_id', entityId);
              sessionStorage.setItem('cart_items', JSON.stringify(cartItemsToSessionStorage));
        }else{
            sessionStorage.removeItem('entity_id');
            sessionStorage.removeItem('cart_items');
        }        
    }
}