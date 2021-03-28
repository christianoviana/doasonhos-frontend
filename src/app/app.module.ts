import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppRoutingModule} from "./app-routing.module";
import {JwtInterceptor} from "./helpers/jwt.interceptor";
import {ErrorInterceptor} from "./helpers/error.interceptor";
import { AppComponent } from './app.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ChartsModule } from 'ng2-charts';

registerLocaleData(localePt);

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';

import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthComponent } from './auth/auth.component';

import { GroupsComponent } from './components/groups/groups.component';
import { GroupComponent } from './components/groups/group-list/group/group.component';
import { GroupCreateComponent } from './components/groups/group-create/group-create.component';
import { GroupListComponent } from './components/groups/group-list/group-list.component';
import { GroupUpdateComponent } from './components/groups/group-update/group-update.component';

import { LoadingComponent } from './shared/loading/loading.component';
import { RegisterComponent } from './components/register/register.component';
import { AlertComponent } from './shared/alert/alert.component';

import { ItemsComponent } from './components/items/items.component';
import { ItemListComponent } from './components/items/item-list/item-list.component';
import { ItemCreateComponent } from './components/items/item-create/item-create.component';
import { ItemUpdateComponent } from './components/items/item-update/item-update.component';
import { ItemComponent } from './components/items/item-list/item/item.component';

import { RolesComponent } from './components/roles/roles.component';
import { RoleListComponent } from './components/roles/role-list/role-list.component';
import { RoleCreateComponent } from './components/roles/role-create/role-create.component';
import { RoleUpdateComponent } from './components/roles/role-update/role-update.component';
import { RoleComponent } from './components/roles/role-list/role/role.component';

import { UsersComponent } from './components/users/users.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserUpdateComponent } from './components/users/user-update/user-update.component';

import { CharitiesComponent } from './components/charities/charities.component';
import { CharityCreateComponent } from './components/charities/charity-create/charity-create.component';
import { CharityUpdateComponent } from './components/charities/charity-update/charity-update.component';

import { CharityListComponent } from './components/charities/charity-list/charity-list.component';
import { CharityComponent } from './components/charities/charity-list/charity/charity.component';
import { CharityDetailComponent } from './components/charities/charity-detail/charity-detail.component';

import { AboutComponent } from './components/about/about.component';
import { PendingsComponent } from './components/pendings/pendings.component';
import { PendingApproveComponent } from './components/pendings/pending-approve/pending-approve.component';
import { PendingDetailComponent } from './components/pendings/pending-detail/pending-detail.component';

import { CharityInformationComponent } from './components/charities/charity-information/charity-information.component';
import { CharityInformationUpdateComponent } from './components/charities/charity-information-update/charity-information-update.component';
import { CharityInformationCreateComponent } from './components/charities/charity-information-create/charity-information-create.component';
import { CharityItemComponent } from './components/charities/charity-item/charity-item.component';
import { DonationsComponent } from './components/donations/donations.component';
import { DonateShoppingComponent } from './components/donations/donate-shopping/donate-shopping.component';
import { DonateCartComponent } from './components/donations/donate-cart/donate-cart.component';
import { DonateItemComponent } from './components/donations/donate-shopping/donate-item/donate-item.component';
import { CartComponent } from './shared/cart/cart.component';
import { DonateCartItemsComponent } from './components/donations/donate-cart/donate-cart-items/donate-cart-items.component';
import { DonorsComponent } from './components/donors/donors.component';
import { DonorPfUpdateComponent } from './components/donors/donor-pf-update/donor-pf-update.component';
import { DonorPjUpdateComponent } from './components/donors/donor-pj-update/donor-pj-update.component';
import { DonateListComponent } from './components/donations/donate-list/donate-list.component';
import { DonorDonationComponent } from './components/donors/donor-donation/donor-donation.component';
import { DonatePaymentComponent } from './components/donations/donate-payment/donate-payment.component';
import { CharityDonationComponent } from './components/charities/charity-donation/charity-donation.component';
import { ReportsComponent } from './components/reports/reports.component';
import { UserReportComponent } from './components/reports/user-report/user-report.component';
import { CharityReportComponent } from './components/reports/charity-report/charity-report.component';

import { NgxMaskModule, IConfig } from 'ngx-mask'

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    GroupsComponent,
    GroupComponent,
    GroupCreateComponent,
    GroupListComponent,
    LoadingComponent,
    RegisterComponent,
    AlertComponent,
    GroupUpdateComponent,
    ItemsComponent,
    ItemListComponent,
    ItemCreateComponent,
    ItemUpdateComponent,
    ItemComponent,
    RolesComponent,
    RoleListComponent,
    RoleCreateComponent,
    RoleUpdateComponent,
    RoleComponent,
    UsersComponent,
    UserCreateComponent,
    UserListComponent,
    UserUpdateComponent,
    CharitiesComponent,
    CharityCreateComponent,
    CharityUpdateComponent,
    CharityListComponent,
    CharityComponent,
    CharityDetailComponent,
    AboutComponent,
    PendingsComponent,
    PendingApproveComponent,
    PendingDetailComponent,
    CharityInformationComponent,
    CharityInformationUpdateComponent,
    CharityInformationCreateComponent,
    CharityItemComponent,
    DonationsComponent,
    DonateShoppingComponent,
    DonateCartComponent,
    DonateItemComponent,
    CartComponent,
    DonateCartItemsComponent,
    DonorsComponent,
    DonorPfUpdateComponent,
    DonorPjUpdateComponent,
    DonateListComponent,
    DonorDonationComponent,
    DonatePaymentComponent,
    CharityDonationComponent,
    ReportsComponent,
    UserReportComponent,
    CharityReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SocialLoginModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    ChartsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue:'pt-BR'},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1055013042266-bgqj135lt6tq6vfinq1qev5ao7h1tkae.apps.googleusercontent.com'
            )
          }//,
          // {
          //   id: FacebookLoginProvider.PROVIDER_ID,
          //   provider: new FacebookLoginProvider('clientId'),
          // },
          // {
          //   id: AmazonLoginProvider.PROVIDER_ID,
          //   provider: new AmazonLoginProvider(
          //     'clientId'
          //   ),
          // },
        ],
      } as SocialAuthServiceConfig,
    }    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
