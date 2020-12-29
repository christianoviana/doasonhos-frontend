import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { AuthApiService } from '../services/auth-api.service';
import { AlertService } from '../services/alert.service';

@Component({
    selector: "app-auth",
    templateUrl:"./auth.component.html",
    styleUrls: ['auth.component.css'] 
})        

export class AuthComponent implements OnInit{
    isLoading: boolean;
    returnUrl: string;
    socialLoginSubscription:any;

    constructor(private authSocialService: SocialAuthService, 
                private authService:AuthApiService,
                private router: Router,
                private route: ActivatedRoute,
                private alertService:AlertService) 
    {
      
    }

    onLoginForm(form:NgForm):void{
      if(!form.valid)
        return;
        
      this.isLoading = true;

      this.authService.authenticate(form.value.email, form.value.password).subscribe(user => {      
        form.reset();
        this.isLoading = false; 
        
        if(this.authService.userValue && 
           this.authService.userValue.userType.toUpperCase() == 'CHARITABLE_ENTITY')
        {
          this.router.navigateByUrl('/charities/information');
        }else{
          this.router.navigateByUrl(this.returnUrl);
        }
      }, error=> {
        this.alertService.error(error);
        this.isLoading = false;
      });    
    }

    onCreateAccount():void{
      this.router.navigate(['/oauth/register']);
    }

    signInWithGoogle(): void {
        this.authSocialService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
            console.log('Success Social Login. Email: ' + user.email);                   
        }).catch(error => {
          console.log('Error Social Login Windows was Closed');
        });
    }
              
    ngOnInit(): void {    
      this.socialLoginSubscription = this.authSocialService.authState.subscribe((user:SocialUser) => {
                   
          if(user && user.idToken){
            this.isLoading = true;
            this.authService.authenticateWithGoogle(user.idToken).subscribe(token => {           
              this.isLoading = false;     
              this.router.navigateByUrl(this.returnUrl);
            }, error=> {
              this.alertService.error(error);
              this.isLoading = false;
              }); 
          }         
        });  
       
       // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';      
    }

    ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      //this.logoutSubscription.unsubscribe();    
      this.socialLoginSubscription.unsubscribe();    
    }
}