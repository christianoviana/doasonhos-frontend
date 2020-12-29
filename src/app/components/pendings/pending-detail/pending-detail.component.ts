import { Component, OnInit } from '@angular/core';
import { CharityStatus } from './charity-status.model';
import { CharityApiService } from '../../../services/charity-api.service';

@Component({
  selector: 'app-pending-detail',
  templateUrl: './pending-detail.component.html',
  styleUrls: ['./pending-detail.component.css']
})
export class PendingDetailComponent implements OnInit {
  search = '';
  charityStatus:CharityStatus;
  hasSearch = false;

  constructor(private charityApi:CharityApiService) { }

  ngOnInit(): void {
  }

  getFormatedDate(date:Date){
    var _date = new Date(date.toString());
    var formatedDate = `${_date.getDate()}/${_date.getMonth()+1}/${_date.getFullYear()} ${_date.toLocaleTimeString()}`; 
   
    return formatedDate;
  }

  getStatus(){
    let status = '';

    switch(this.charityStatus.status){
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

  searchCharity(){
    this.charityApi.getCharityStatus(this.search).then(charityStatus => {
      this.charityStatus = charityStatus;
      
      this.hasSearch = true;
    }).catch(err => {
      console.log(err);    
    });
  }

}
