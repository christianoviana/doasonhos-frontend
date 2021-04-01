import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { GroupsComponent} from "./components/groups/groups.component";
import { GroupCreateComponent } from "./components/groups/group-create/group-create.component";
import { GroupUpdateComponent } from "./components/groups/group-update/group-update.component";
import { GroupListComponent } from './components/groups/group-list/group-list.component';

import { RolesComponent} from "./components/roles/roles.component";
import { RoleCreateComponent } from "./components/roles/role-create/role-create.component";
import { RoleUpdateComponent } from "./components/roles/role-update/role-update.component";
import { RoleListComponent } from './components/roles/role-list/role-list.component';

import { ItemsComponent} from "./components/items/items.component";
import { ItemListComponent } from './components/items/item-list/item-list.component';
import { ItemCreateComponent } from './components/items/item-create/item-create.component';
import { ItemUpdateComponent } from './components/items/item-update/item-update.component';

import { UsersComponent} from "./components/users/users.component";
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserCreateComponent } from './components/users/user-create/user-create.component';
import { UserUpdateComponent } from './components/users/user-update/user-update.component';

import { CharitiesComponent} from "./components/charities/charities.component";
import { CharityListComponent } from './components/charities/charity-list/charity-list.component';
import { CharityCreateComponent } from './components/charities/charity-create/charity-create.component';
import { CharityUpdateComponent } from './components/charities/charity-update/charity-update.component';
import { CharityItemComponent } from './components/charities/charity-item/charity-item.component';
import { CharityDetailComponent } from './components/charities/charity-detail/charity-detail.component';
import { CharityInformationComponent } from './components/charities/charity-information/charity-information.component';
import { CharityInformationUpdateComponent } from './components/charities/charity-information-update/charity-information-update.component';
import { CharityInformationCreateComponent } from './components/charities/charity-information-create/charity-information-create.component';
import { CharityDonationComponent } from './components/charities/charity-donation/charity-donation.component';

import { DonationsComponent} from "./components/donations/donations.component";
import { DonateShoppingComponent} from "./components/donations/donate-shopping/donate-shopping.component";
import { DonatePaymentComponent} from "./components/donations/donate-payment/donate-payment.component";
import { DonateCartItemsComponent} from "./components/donations/donate-cart/donate-cart-items/donate-cart-items.component";

import { PendingsComponent} from "./components/pendings/pendings.component";
import { PendingDetailComponent } from './components/pendings/pending-detail/pending-detail.component';
import { PendingApproveComponent } from './components/pendings/pending-approve/pending-approve.component';

import {AuthComponent} from "./auth/auth.component";
import {RegisterComponent} from "./components/register/register.component";

import {AboutComponent} from "./components/about/about.component";
import {HomeComponent} from "./components/home/home.component";

import { AuthGuard } from './helpers/auth.guard';
import { DonateCartComponent } from './components/donations/donate-cart/donate-cart.component';

import { DonorsComponent } from './components/donors/donors.component';
import { DonorPfUpdateComponent } from './components/donors/donor-pf-update/donor-pf-update.component';
import { DonorPjUpdateComponent } from './components/donors/donor-pj-update/donor-pj-update.component';
import { DonorDonationComponent } from './components/donors/donor-donation/donor-donation.component';

import { ReportsComponent } from './components/reports/reports.component';
import {UserReportComponent } from './components/reports/user-report/user-report.component';
import { CharityReportComponent } from './components/reports/charity-report/charity-report.component';

const routes: Routes = [
  {
      path:'', redirectTo: "home", pathMatch:'full'
  },
  {
      path:'home', component: HomeComponent
  },
  {
    path:'about', component: AboutComponent
  },
  {
    path:'groups', component: GroupsComponent, canActivate: [AuthGuard],
    children: [
      {path:'list', component: GroupListComponent},
      {path:'create', component: GroupCreateComponent},
      {path:'update/:id', component: GroupUpdateComponent},
     
      {path:'', redirectTo:'/groups/list', pathMatch:'full'}
    ]
  },
  {
    path:'roles', component: RolesComponent, canActivate: [AuthGuard],
    children: [
      {path:'list', component: RoleListComponent},
      {path:'create', component: RoleCreateComponent},
      {path:'update/:id', component: RoleUpdateComponent},     
      {path:'', redirectTo:'/roles/list', pathMatch:'full'}
    ]
  },
  {
    path:'items', component: ItemsComponent, canActivate: [AuthGuard],
    children: [
      {path:'list', component: ItemListComponent},     
      {path:'create', component: ItemCreateComponent},     
      {path:'update/:id', component: ItemUpdateComponent},     
      {path:'', redirectTo:'/items/list', pathMatch:'full'}
    ]
  },
  {
    path:'users', component: UsersComponent, canActivate: [AuthGuard],
    children: [
      {path:'list', component: UserListComponent},       
      {path:'create', component: UserCreateComponent},       
      {path:'update/:id', component: UserUpdateComponent},       
      {path:'', redirectTo:'/users/list', pathMatch:'full'}
    ]
  },
  {
    path:'charities', component: CharitiesComponent,
    children: [
      {path:'list', component: CharityListComponent},              
      {path:'information', component: CharityInformationComponent, canActivate: [AuthGuard]},              
      {path:'information/update', component: CharityInformationUpdateComponent, canActivate: [AuthGuard]},              
      {path:'information/create', component: CharityInformationCreateComponent, canActivate: [AuthGuard]},              
      {path:'create', component: CharityCreateComponent},                    
      {path:'update', component: CharityUpdateComponent, canActivate: [AuthGuard]},       
      {path:'item', component: CharityItemComponent, canActivate: [AuthGuard]},       
      {path:'donation', component: CharityDonationComponent, canActivate: [AuthGuard]},          
      {path:':id', component: CharityDetailComponent},          
      {path:'', redirectTo:'/charities/list', pathMatch:'full'}
    ]
  },
  {
    path:'donations', component: DonationsComponent,
    children: [           
      {path:'payment', component: DonatePaymentComponent, canActivate: [AuthGuard]},       
      {path:'cart', component: DonateCartComponent},       
      {path:':id', component: DonateShoppingComponent},        
      {path:'', redirectTo:'/charities/list', pathMatch:'full'}
    ]
  },
  {
    path:'pendings', component: PendingsComponent,
    children: [
      {path:'approve', component: PendingApproveComponent, canActivate: [AuthGuard]},   
      {path:'detail', component: PendingDetailComponent},       
      {path:'', redirectTo:'/pendings/detail', pathMatch:'full'}
    ]
  },
  {
    path:'donors', component: DonorsComponent, canActivate: [AuthGuard],
    children: [
      {path:'update-pf', component: DonorPfUpdateComponent},       
      {path:'update-pj', component: DonorPjUpdateComponent},       
      {path:'donation', component: DonorDonationComponent},       
      {path:'', redirectTo:'/home', pathMatch:'full'}
    ]
  },
  {
    path:'reports', component: ReportsComponent, canActivate: [AuthGuard],
    children: [
      {path:'charities', component: CharityReportComponent},       
      {path:'users', component: UserReportComponent},       
    ]
  },
  {
    path: 'oauth/login', component:AuthComponent 
  }, 
  { 
    path:'oauth/register', component:RegisterComponent 
  }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})


export class AppRoutingModule {  
}
