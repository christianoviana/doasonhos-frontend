import { Component, OnInit } from '@angular/core';
import { DonorPF } from '../../register/donor-pf.model';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RegisterApiService } from '../../../services/register-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { State } from '../../../core/models/state.model';
import { IbgeApiService } from '../../../services/ibge.service';

@Component({
  selector: 'app-donor-pf-update',
  templateUrl: './donor-pf-update.component.html',
  styleUrls: ['./donor-pf-update.component.css']
})
export class DonorPfUpdateComponent implements OnInit {
  
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z0-9 áéíóúÁÉÍÓÚâêôÂÊÔãñõÃÑÕçÇ\]')} };
  isLoading = false;
  donorPf:DonorPF;
  States:Array<State>;

  constructor(private router:Router,
              private alertService:AlertService,              
              private registerApi:RegisterApiService,
              private authService:AuthApiService,
              private ibgeService:IbgeApiService) { }

  ngOnInit(): void {
    const donorId = this.authService.userValue.ownerId;

    this.registerApi.getDonorPF(donorId).then(donor => {              
      this.donorPf = donor;
      console.log(this.donorPf);
    }).catch(error => {    
      this.donorPf = undefined; 
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
   
      let donorPF:any = { name:form.value.name, cpf:form.value.cpf, birthday: form.value.birthday, 
                                genre:form.value.genre, country:form.value.country, state:form.value.state, 
                                city:form.value.city }

        this.registerApi.putDonorPF(donorPF, donorId).then(() => {
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
