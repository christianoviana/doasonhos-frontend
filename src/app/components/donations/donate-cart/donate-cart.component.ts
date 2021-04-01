import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import {Location} from '@angular/common';
import { Charity } from '../../charities/charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { Subscription } from 'rxjs';
import { DonationApiService } from '../../../services/donation-api.service';
import { AuthApiService } from '../../../services/auth-api.service';

@Component({
  selector: 'app-donate-cart',
  templateUrl: './donate-cart.component.html',
  styleUrls: ['./donate-cart.component.css']
})
export class DonateCartComponent implements OnInit, OnDestroy {
  charity:Charity;
  charityId: string;
  cartSubscribe: Subscription;  
  isLoading: boolean;

  cartItems:Array<CartItem>;
  onlyMoney: boolean = false;

  constructor(private shoppingCartService:ShoppingCartService,
              private charityApi:CharityApiService,
              private DonationApi:DonationApiService,
              private _location: Location,
              private authService:AuthApiService) { }

  ngOnDestroy(): void {   
    this.cartSubscribe.unsubscribe();
  }

  async ngOnInit() {
    if(this.shoppingCartService.itemsValue()){
      this.onlyMoney = this.shoppingCartService.itemsValue().find(c => c.getItem().name == '') ? true : false;
    }
       
    this.charityId =  this.shoppingCartService.getCharityEntityFromSession();
    
    const charityPromise = this.charityApi.getCharitiesById(this.charityId); 

    try {      
      this.charity = await charityPromise;
      this.cartItems = this.shoppingCartService.itemsValue();
    } catch (error) {
      console.log(error);
    }   
    finally{
    }  

    this.cartSubscribe = this.shoppingCartService.itemsObservable().subscribe((_cartItems:Array<CartItem>) => {
      this.charityId =  this.shoppingCartService.getCharityEntityFromSession();
      this.cartItems = _cartItems;
    });
  }

  clearShoppingCart(){
    try {      
      this.isLoading = true; 
      this.shoppingCartService.clear();
    } catch (error) {
      console.log(error);
    }   
    finally{
      this.isLoading = false;
    }  
  }

  type(){
    if(this.total() == 0){
      return 'presencial';
    }
    else{
      return 'online';
    }
  }

  back(){
    this._location.back();
  }

  total(){
    return this.shoppingCartService.total();
  }
}
