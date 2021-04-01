import {Item} from '../../components/items/item.model';

export class CartItem{
    maxQuantity = 50;

    constructor(private item:Item, private quantity:number) {
        this.quantity = quantity;
    }

    getTotal(){
        return this.item.price * this.quantity;
    }

    getQuantity(){
        return this.quantity;
    }

    increment(){
        if(this.quantity < this.maxQuantity)
           this.quantity += 1;
    }

    decrease(){
        if(this.quantity > 1)
           this.quantity -= 1;
    }

    getItemId(){
        return this.item.id;
    }

    getItem(){
        return this.item;
    }
}