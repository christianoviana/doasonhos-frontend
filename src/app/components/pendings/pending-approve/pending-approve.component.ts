import { Component, OnInit } from '@angular/core';
import { CharityApiService } from '../../../services/charity-api.service';
import { PendingCharities } from './pending-charities.model';
import { AuthApiService } from '../../../services/auth-api.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-pending-approve',
  templateUrl: './pending-approve.component.html',
  styleUrls: ['./pending-approve.component.css']
})
export class PendingApproveComponent implements OnInit {
  userLogged:User;
  pendingCharities:Array<PendingCharities>;
  filteredPendingCharities:PendingCharities;
  selectedCharity:any;
  hasSearch = false;
  total = 0;
  newStatus = '';  
  isLoading = false;
  message:any;

  constructor(private charityApi:CharityApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.charityApi.getCharityPendingsByState().then(res => {
      this.pendingCharities = res;

      if(this.pendingCharities && this.pendingCharities.length > 0){
        this.total = this.pendingCharities.map(p=>p.charities.length).reduce((accumulate, current) => accumulate + current);
      }

      this.hasSearch = true;
    }).catch(err => {
      console.log(err);    
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onStateChange(value:string){
    this.filteredPendingCharities = undefined;

    if(this.pendingCharities){
       this.filteredPendingCharities = this.pendingCharities.filter(c => c.state == value)[0];
    }
  }

  charityChangeStatus(charity:any, status:any){
    this.isLoading = true;

    this.userLogged = this.authService.userValue;
    
    let approveData = {message:this.getStatus(status), details:this.message, status:status, approver_name:this.userLogged.userName};
    this.charityApi.putCharityPeding(charity.id, approveData).then(res => {
      this.pendingCharities = undefined;
      this.filteredPendingCharities = undefined;
      this.total = 0;

      this.charityApi.getCharityPendingsByState().then(res => {
        this.pendingCharities = res;
        if(this.pendingCharities && this.pendingCharities.length > 0){
          this.total = this.pendingCharities.map(p=>p.charities.length).reduce((accumulate, current) => accumulate + current);
        }
        
        this.hasSearch = true;
      }).catch(err => {
        console.log(err);    
      }).finally(() => {
        this.isLoading = false;
      });
    }).catch(err => {
      console.log(err);    
    }).finally(()=>{
      this.isLoading = false;
    });
  }

  getStatus(statusDto:string){
    let status = '';

    switch(statusDto){
      case 'PENDING':
        status = 'Análise Pendente';
        break;
      case 'ANALYZING':
        status = 'Análise em Andamento';
        break;
      case 'PENDING_DATA':
        status = 'Dados Pendentes';
        break;
      case 'REPROVED':
        status = 'Cadastro Reprovado';
         break;
      case 'APPROVED':
        status = 'Cadastro Aprovado';
        break;
    }
    return status;
  }
  

}
