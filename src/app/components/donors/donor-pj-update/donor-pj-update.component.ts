import { Component, OnInit } from '@angular/core';
import { DonorPJ } from '../../register/donor-pj.model';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RegisterApiService } from '../../../services/register-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { State } from '../../../core/models/state.model';
import { IbgeApiService } from '../../../services/ibge.service';

@Component({
  selector: 'app-donor-pj-update',
  templateUrl: './donor-pj-update.component.html',
  styleUrls: ['./donor-pj-update.component.css']
})
export class DonorPjUpdateComponent implements OnInit {
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z0-9 áéíóúÁÉÍÓÚâêôÂÊÔãñõÃÑÕçÇ\]')} };
  isLoading = false;
  donorPj:DonorPJ;
  States:Array<State>;

  constructor(private router:Router,
              private alertService:AlertService,              
              private registerApi:RegisterApiService,
              private authService:AuthApiService,
              private ibgeService:IbgeApiService) { }

  ngOnInit(): void {
    const donorId = this.authService.userValue.ownerId;

    this.registerApi.getDonorPJ(donorId).then(donor => {              
      this.donorPj = donor;
    }).catch(error => {    
      this.donorPj = undefined; 
      this.alertService.error(error);
    });

    this.ibgeService.getStates().then(res => {
      this.States = <State[]>res;
    }).catch(err => {   
      console.log(err);     
    });
  }

  onUpdate(form:NgForm):void{
    if(!form.valid)
      return;
      
      this.isLoading = true;        
      const donorId = this.authService.userValue.ownerId;
   
      let donorPJ:any = { company_name:form.value.companyName, contact_name:form.value.contactName, 
                              cnpj:form.value.cnpj, country:form.value.country, state:form.value.state, 
                              city:form.value.city }

        this.registerApi.putDonorPJ(donorPJ, donorId).then(() => {
            this.isLoading = false;  

            this.alertService.success('Dados atualizados com sucesso.'); 
        }).catch(error => {         
            this.isLoading = false;
            this.alertService.error(error);
  
        }).finally(() => {
           window.scroll(0,0);
        });        
  } 

}
