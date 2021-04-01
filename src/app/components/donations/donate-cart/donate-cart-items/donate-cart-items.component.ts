import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';
import { CartItem } from '../../../../core/models/cart-item.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { Item } from '../../../items/item.model';

@Component({
  selector: 'app-donate-cart-items',
  templateUrl: './donate-cart-items.component.html',
  styleUrls: ['./donate-cart-items.component.css']
})
export class DonateCartItemsComponent implements OnInit, OnDestroy {
  cartItems:Array<CartItem>;
  cartSubscribe:Subscription;
  lstQnt = new Array(30); 
  @Input() charityId:string;
  onlyMoney:boolean=false

  constructor(private shoppingCartService:ShoppingCartService) { }
 
  ngOnInit(): void {
    this.cartItems = this.shoppingCartService.itemsValue();
    
    this.cartSubscribe = this.shoppingCartService.itemsObservable().subscribe((_cartItems:Array<CartItem>) => {
      this.cartItems = _cartItems;
    });
  }

  decrease(cartItem:CartItem){
    cartItem.decrease();
    this.shoppingCartService.addCartItems(this.shoppingCartService.itemsValue(), this.charityId);
  }

  increase(cartItem:CartItem){
    cartItem.increment();
    this.shoppingCartService.addCartItems(this.shoppingCartService.itemsValue(), this.charityId);
  }

  type(){
    if(this.shoppingCartService.total() == 0){
      return 'presencial';
    }
    else{
      return 'online';
    }
  }

  removeFromCart(item:Item){
    this.shoppingCartService.removeFromCart(item, this.charityId);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cartSubscribe.unsubscribe();
  }

}
