import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CharityApiService } from '../../../services/charity-api.service';
import { CepApiService } from '../../../services/cep.service';
import { Cep } from '../../../core/models/cep.model';

@Component({
  selector: 'app-charity-update',
  templateUrl: './charity-update.component.html',
  styleUrls: ['./charity-update.component.css']
})
export class CharityUpdateComponent implements OnInit {
  cep:Cep = undefined;
  isLoading = false;

  constructor(private charityService: CharityApiService,
              private cepService:CepApiService) { }

  ngOnInit(): void {
  }

  onSaveCharity(form:NgForm):void{
    if(!form.valid)
      return;
  }

  onCepEvent(event:any){
    let cep:string = event.target.value.replace('-','').substring(0, 9);

    this.cepService.getCep(cep).then(address => {
        this.cep = address;
    }).catch(error => {
      this.cep = { logradouro:'', localidade:'', uf:'', estado:'', bairro:'' };
    });
  }
}
