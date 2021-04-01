import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CharityApiService } from '../../../services/charity-api.service';
import { CepApiService } from '../../../services/cep.service';
import { Cep } from '../../../core/models/cep.model';
import { AlertService } from '../../../services/alert.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { Charity } from '../charity.model';

@Component({
  selector: 'app-charity-update',
  templateUrl: './charity-update.component.html',
  styleUrls: ['./charity-update.component.css']
})

export class CharityUpdateComponent implements OnInit {
  cep:Cep = undefined;
  isLoading = false;
  isApproved = false;
  charity:Charity;
  message ='';  
  errorMessage ='';  
  country='Brasil';
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z0-9 áéíóúÁÉÍÓÚâêôÂÊÔãñõÃÑÕçÇ\]')} };

  constructor(private charityService: CharityApiService,
              private alertService:AlertService,
              private cepService:CepApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {          
    if(this.authService.userValue){
      this.isLoading = true;      
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      this.charityService.getCharitiesById(id).then(charity => {
        this.charity = charity;
        
        this.isApproved = this.charity.status.toUpperCase() == 'APPROVED';

        this.cep = 
        {
            bairro: this.charity.address.district, logradouro:  this.charity.address.address_name,
            estado:this.charity.address.state, localidade:this.charity.address.city, uf:'' 
        };
        
      }).catch(error => {
        console.log(error);
      }).finally(()=>{
        this.isLoading = false
      });  
    }        
  }

  onUpdateCharity(form:NgForm):void{
    if(!form.valid)
      return;
      
      this.isLoading = true;   
      const id = this.authService.userValue && this.authService.userValue.ownerId;  

      let _charity = 
      {
        id:null, name:form.value.name, cnpj:form.value.cnpj, representant_name:form.value.representantName,
        cellphone:form.value.cellphone, telephone:form.value.telephone, 
        address:{cep:form.value.cep, address_name:form.value.addressName, district:form.value.district, country:form.value.country, state:form.value.state, city:form.value.city, number:form.value.number, complement:form.value.complement}, 
        login:form.value.email, password:form.value.password
      };

      if(this.isApproved){
        _charity.name = this.charity.name;
        _charity.cnpj = this.charity.cnpj;
      }
    
      this.charityService.putCharity(_charity, id, this.isApproved ? false : true).then(() => {    
        this.isLoading = false;           
        this.alertService.success('A entidade foi atualizada com sucesso.'); 
      }).catch(error => {     
        this.alertService.error(error);
        this.isLoading = false;
      }).finally(() => {
        window.scroll(0,0);
      });       
  }


  onCepEvent(event:any){
    let cep:string = event.target.value.replace('-','').substring(0, 9);
    this.message = '';
    this.errorMessage = '';

    if(cep.length == 8){
      this.cepService.getCep(cep).then(address => {
        if(address.estado == '')
        {
          this.message = 'O cep é inválido';            
          return;
        }
  
        this.country='Brasil';
        this.cep = address;
      }).catch(error => {
        console.log(error);
        this.errorMessage = 'Erro ao obter o cep.';     
          this.country='Brasil';
          this.cep = { logradouro:'', localidade:'', uf:'', estado:'', bairro:'' };
      });
    }   
  }
}
