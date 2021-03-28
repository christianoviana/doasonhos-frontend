import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Payment} from './payment.model';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import {Location} from '@angular/common';
import { Charity } from '../../charities/charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { Subscription } from 'rxjs';
import { DonationApiService } from '../../../services/donation-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donate-payment',
  templateUrl: './donate-payment.component.html',
  styleUrls: ['./donate-payment.component.css']
})
export class DonatePaymentComponent implements OnInit {
  payment:Payment = {'owner_name':'', 'card_number':null, 'card_validate':'',  'security_code':'', 'cpf_cnpj':'', 'telephone':''};
  @Output() onFinishPayment = new EventEmitter<Payment>();

  charity:Charity;
  charityId: string;
  cartSubscribe: Subscription;  
  isLoading: boolean;
  messagePayment:any = {isSuccess:false, message:''};
  
  cartItems:Array<CartItem>;

  constructor(private shoppingCartService:ShoppingCartService,
              private charityApi:CharityApiService,
              private DonationApi:DonationApiService,
              private _location: Location,
              private authService:AuthApiService,
              private router: Router) { }

  async ngOnInit(){
    if(this.shoppingCartService.itemsValue() != undefined){
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
  }

  ngOnDestroy(): void {   
    this.cartSubscribe.unsubscribe();
  }

  donate(){   
    this.isLoading = true;
    
    const _donorId = this.authService.userValue.userId;
    const _charityId = this.charityId;
    const _total = this.total();

    var items = [];

    if(this.cartItems){
      this.cartItems.forEach(ci => {
        items.push({'item_id':ci.getItemId(), 'item_quantity':ci.getQuantity()})
      });
    }  

    var donation = {
      'donor_id': _donorId,
      'charitable_entity_id': _charityId,
      'items': items,
      'total': _total
    };

    console.log(donation);

    if(this.type() == 'online'){
      this.DonationApi.postDonationOnline(donation).then(() => {
        
        if(this.onFinishPayment)      
          this.onFinishPayment.emit(this.payment);
          this.messagePayment.message = 'A sua doação foi realizada com sucesso.';
          this.messagePayment.isSuccess = true;

          this.shoppingCartService.clear();        
      }).catch((error => {
        this.messagePayment.message = 'Ocorreu um erro ao processar a sua doação. Por favor, tente novamente mais tarde.';
        this.messagePayment.isSuccess = false;
        console.log(error);
      })).finally(() => {
          this.isLoading = false;

          const resultModal = document.getElementById('modalTrigger');
          resultModal.click();  
      });
    }else if(this.type() == 'presencial'){
      this.DonationApi.postDonationPresencial(donation).then(() => {        
        if(this.onFinishPayment)      
          this.onFinishPayment.emit(this.payment);
          this.messagePayment.message = 'A sua doação foi realizada com sucesso.';
          this.messagePayment.isSuccess = true;

          this.shoppingCartService.clear();
      }).catch((error => {
        this.messagePayment.message = 'Ocorreu um erro ao processar a sua doação. Por favor, tente novamente mais tarde.';
        this.messagePayment.isSuccess = false;
        console.log(error);
      })).finally(() => {
          this.isLoading = false;

          const resultModal = document.getElementById('modalTrigger');
          resultModal.click();  
      });
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

  goToHome(){
    this.router.navigate(['/home']);
  }

}
