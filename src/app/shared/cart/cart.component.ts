import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter, skip } from 'rxjs/operators';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  totalItems:string = '00';
  itemSubscribe:Subscription;
  currentUrl:string;

  constructor(private shoppingCartService:ShoppingCartService, private router:Router, 
              private authService:AuthApiService) { }

  ngOnInit(): void {
    this.itemSubscribe = this.shoppingCartService.itemsObservable().pipe(skip(1)).subscribe((cartItems:Array<CartItem>) => {
     this.totalItems = this.padLeft(cartItems.length, 2);
    });  

    this.router.events.pipe(filter(e => e instanceof(NavigationEnd))).subscribe((nav:NavigationEnd) => {
      this.currentUrl = nav.url;
    });

    const itemsFromSessionStorage = sessionStorage.getItem('cart_items');

    if(itemsFromSessionStorage){
       this.shoppingCartService.addCartItemsFromSession(JSON.parse(itemsFromSessionStorage));
    }    
  }

  isCharity():boolean{
    if(!this.authService.userValue)
      return false;

    return this.authService.userValue.userType.toLowerCase() === 'charitable_entity';
  }

  isCartOrPaymentPage(){
    return this.currentUrl == '/donations/cart' || this.currentUrl == '/donations/payment';
  }

  goToCart(){
    this.router.navigateByUrl('/donations/cart');
  }

  padLeft(nr, n, str = '0'){
    return Array(n-String(nr).length+1).join(str)+nr;
  }
}
