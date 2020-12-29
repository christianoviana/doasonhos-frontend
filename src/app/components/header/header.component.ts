import { Component, OnInit, HostListener } from '@angular/core';
import { AuthApiService } from '../../services/auth-api.service';
import { User } from '../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  fixedNavbar:boolean = false;
  userLogged:User;
  userSubscription:Subscription;

  constructor(private authService:AuthApiService) { }

  ngOnInit(): void {
    this.userLogged = this.authService.userValue;
    
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userLogged = user;
    });
  }

  isAdmin():boolean{
    return this.userLogged.userType.toLowerCase() === 'administrator';
  }

  isMaster():boolean{
    return this.userLogged.userType.toLowerCase() === 'administrator' || 
           this.userLogged.userType.toLowerCase() === 'manager';
  }

  isCharity():boolean{
    return this.userLogged.userType.toLowerCase() === 'charitable_entity';
  }

  getName():string{
    if(this.userLogged && 
       this.userLogged.userType.toLowerCase() !== 'administrator' && 
       this.userLogged.userType.toLowerCase() !== 'manager' &&       
       this.userLogged.userType.toLowerCase() !== 'external'){         
      let name = this.userLogged.ownerName;
      let userName = '';
  
      if(name && name.trim() !== ''){
          let nameArray = name.split(' ');
          const notNames = ['dos', 'das', 'do', 'da', 'de'];

          if(nameArray.length > 2){                      
            if(notNames.includes(nameArray[1].toLowerCase()))
               userName = nameArray[0] + ' ' + nameArray[1] + ' ' + nameArray[2];
            else{
              userName = nameArray[0] + ' ' + nameArray[1];
            }            
          }else if (nameArray.length > 1){
            userName = nameArray[0] + ' ' + nameArray[1];
          }else if (nameArray.length > 0){
            userName = nameArray[0];
          }
      }
  
      return userName;
    }
    else{
      if( this.userLogged.userType.toLowerCase() === 'administrator' ){
        return this.userLogged.userName + ' (Administrador)'; 
      }
      else if( this.userLogged.userType.toLowerCase() === 'manager' ){
        return this.userLogged.userName + ' (Gerente)'; 
      } 
      else if( this.userLogged.userType.toLowerCase() === 'external' ){
        return this.userLogged.userName; 
      }      
    }   
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSubscription.unsubscribe();    
  }

  onLogout(){
    this.authService.logout();
  }
  
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    const verticalOffset = window.pageYOffset 
    || document.documentElement.scrollTop 
    || document.body.scrollTop || 0;

    let headerTopHeight = document.getElementById("header-top").clientHeight || 0;

    if(verticalOffset > headerTopHeight){
      this.fixedNavbar = true
    }else{
      this.fixedNavbar = false;
    }
  } 
}
