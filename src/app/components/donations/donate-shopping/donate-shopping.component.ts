import { Component, OnInit, OnDestroy } from '@angular/core';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { ActivatedRoute } from '@angular/router';
import { Charity } from '../../charities/charity.model';
import { Item } from '../../Items/item.model';
import { CartItem } from '../../../core/models/cart-item.model';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-donate-shopping',
  templateUrl: './donate-shopping.component.html',
  styleUrls: ['./donate-shopping.component.css']
})
export class DonateShoppingComponent implements OnInit, OnDestroy {

  constructor(private charityApi:CharityApiService,
              private authService:AuthApiService,
              private shoppingCartService:ShoppingCartService,
              private router:ActivatedRoute) { }

  charityId:string;
  isLoading: boolean;
  items:Array<Item>;
  filteredItems:Array<Item>;
  charity:Charity;
  donationType:string = 'online';
  selectedItem:Item;
  itemSubscribe:Subscription;
  cartItems:Array<CartItem>=[];
  alreadyAdded:boolean = false;
  hasSearch:boolean = false;

  async ngOnInit() {
    this.isLoading = true;   
    this.charityId =  this.router.snapshot.paramMap.get('id');   
       
    const itemPromise    = this.charityApi.getCharityItems(this.charityId); 
    const charityPromise = this.charityApi.getCharitiesById(this.charityId); 

    try {      
      this.items = await itemPromise;
      this.charity = await charityPromise;

      if(this.donationType == 'online')
        this.filteredItems = this.items.filter(i => i.price > 0);
      else if(this.donationType == 'presencial')
        this.filteredItems = this.items.filter(i => i.price <= 0);
    } catch (error) {
      console.log(error);
    }   
    finally{
      this.hasSearch = true;
    }  

    this.itemSubscribe = this.shoppingCartService.itemsObservable().subscribe((_cartItems:Array<CartItem>) => {
      this.cartItems = _cartItems;     
    });
  }

  onRadioChange(value)
  {
    this.donationType = value;

    if(this.donationType == 'online')
      this.filteredItems = this.items.filter(i => i.price > 0);
    else if(this.donationType == 'presencial')
      this.filteredItems = this.items.filter(i => i.price <= 0);
  }
  
  onItemClicked(item:Item){
    if(this.shoppingCartService.getCharityEntityFromSession() == this.charityId)
    {
        if(this.cartItems.find(ci => ci.getItemId() == item.id)){
          this.alreadyAdded = true;
        }else{
          this.alreadyAdded = false;
        }
    }else{
      this.alreadyAdded = false;
    }   

    this.selectedItem = item;
  }

  AddToCart(item:Item){

    if(this.shoppingCartService.getCharityEntityFromSession() == this.charityId)
    {
      let items = this.shoppingCartService.itemsValue();

      if(items){
        if(items.find(ci => ci.getItem().price == 0)){
          if(item.price > 0)
             this.shoppingCartService.clear();
        }else{
          if(item.price == 0)
             this.shoppingCartService.clear();
        }
      }
  
      this.shoppingCartService.addToCart(item, this.charityId);
    }else{
      this.shoppingCartService.clear();
      this.shoppingCartService.addToCart(item,this.charityId);
    }
   
  }

  RemoveFromCart(item:Item){
    this.shoppingCartService.removeFromCart(item, this.charityId);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.itemSubscribe.unsubscribe();
  }
}
