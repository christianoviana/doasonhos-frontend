import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import {Location} from '@angular/common';
import { Charity } from '../../charities/charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { CartItem } from '../../../core/models/cart-item.model';

@Component({
  selector: 'app-donate-cart',
  templateUrl: './donate-cart.component.html',
  styleUrls: ['./donate-cart.component.css']
})
export class DonateCartComponent implements OnInit, OnDestroy {
  charity:Charity;
  charityId: string;
  cartSubscribe: any;

  constructor(private shoppingCartService:ShoppingCartService,
              private charityApi:CharityApiService,
              private _location: Location) { }

  async ngOnInit() {
    this.charityId =  this.shoppingCartService.getCharityEntityFromSession();
    
    const charityPromise = this.charityApi.getCharitiesById(this.charityId); 

    try {      
      this.charity = await charityPromise;
    } catch (error) {
      console.log(error);
    }   
    finally{
    }  

    this.cartSubscribe = this.shoppingCartService.itemsObservable().subscribe((_cartItems:Array<CartItem>) => {
      this.charityId =  this.shoppingCartService.getCharityEntityFromSession();
    });
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

  ngOnDestroy(): void {
  }

}
