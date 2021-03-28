import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CharityApiService } from '../../../services/charity-api.service';
import { AlertService } from '../../../services/alert.service';
import { CepApiService } from '../../../services/cep.service';
import { Cep } from '../../../core/models/cep.model';

@Component({
  selector: 'app-charity-create',
  templateUrl: './charity-create.component.html',
  styleUrls: ['./charity-create.component.css']
})
export class CharityCreateComponent implements OnInit {
  isLoading = false;
  cep:Cep = undefined;
  message ='';

  @ViewChild('charityForm') private charityForm: NgForm;

  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z0-9 \]')} };

  constructor(private charityService: CharityApiService,
              private alertService:AlertService,
              private cepService:CepApiService) { }

  ngOnInit(): void {
  }

  onSaveCharity(form:NgForm):void{
    if(!form.valid)
      return;
      
      this.isLoading = true;     

      let charity = 
      {
        id:null, name:form.value.name, cnpj:form.value.cnpj, representant_name:form.value.representantName,
        cellphone:form.value.cellphone, telephone:form.value.telephone, 
        address:{cep:form.value.cep, address_name:form.value.addressName, district:form.value.district, country:form.value.country, state:form.value.state, city:form.value.city, number:form.value.number, complement:form.value.complement}, 
        login:form.value.email, password:form.value.password
      };

      form.resetForm();
    
      this.charityService.postCharity(charity).then(() => {            
        form.resetForm();
        console.log(form)
        this.isLoading = false;           
        this.alertService.success('Cadastro enviado com sucesso para aprovação.'); 
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

    if(cep.length == 8){
        this.cepService.getCep(cep).then(address => {      
          if(address.estado == '')
          {
            this.message = 'O cep é inválido';            
            return;
          }

          this.cep = address;
      }).catch(error => {
        console.log(error);
        this.cep = { logradouro:'', localidade:'', uf:'', estado:'', bairro:'' };
      });
    }   
  }

}
