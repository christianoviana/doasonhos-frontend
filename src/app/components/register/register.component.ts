import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterApiService } from '../../services/register-api.service';
import { DonorPF } from './donor-pf.model';
import { DonorPJ } from './donor-pj.model';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerType = 'PF';
  isLoading = false;
  hasSuccessRegistered = false;

  constructor(private router:Router,
              private registerApi:RegisterApiService,
              private alertService:AlertService) { }

  ngOnInit(): void {
  }

  onLogin():void{
    this.router.navigate(['oauth/login']);
  }

  onSignUp(form:NgForm):void{
    if(!form.valid)
      return;
      
      this.isLoading = true;        
      console.log(form.value);

      if(this.registerType == 'PF'){
        let donorPF:DonorPF = { name:form.value.name, cpf:form.value.cpf, birthday: form.value.birthday, 
                                genre:form.value.genre, country:form.value.country, state:form.value.state, 
                                city:form.value.city, login:form.value.email, password:form.value.password }

        this.registerApi.postDonorPF(donorPF).then(() => {
            form.reset();
            this.isLoading = false;  
            this.hasSuccessRegistered = true;

            this.alertService.success('Doador cadastrado com sucesso.'); 
        }).catch(error => {         
            this.isLoading = false;
            this.hasSuccessRegistered = false;

            this.alertService.error(error);
  
        }).finally(() => {
           window.scroll(0,0);
        });        
      }
      else if(this.registerType == 'PJ'){
          let donorPJ:DonorPJ = { company_name:form.value.companyName, contact_name:form.value.contactName, 
                                  cnpj:form.value.cnpj, country:form.value.country, state:form.value.state, 
                                  city:form.value.city, login:form.value.email, password:form.value.password }

          this.registerApi.postDonorPJ(donorPJ).then(() => {
            form.reset();
            this.isLoading = false;           
            this.alertService.success('Doador cadastrado com sucesso.'); 
          }).catch(error => {
            this.alertService.error(error);
            this.isLoading = false;
          }).finally(() => {
            window.scroll(0,0);
          });
      } 
  }
}
