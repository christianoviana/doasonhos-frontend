import { Component, OnInit } from '@angular/core';
import { Charity } from '../charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { IbgeApiService } from '../../../services/ibge.service';
import { Pagination } from '../../../core/models/pagination.model';
import { State } from '../../../core/models/state.model';
import { City } from '../../../core/models/city.model';


@Component({
  selector: 'app-charity-list',
  templateUrl: './charity-list.component.html',
  styleUrls: ['./charity-list.component.css']
})
export class CharityListComponent implements OnInit {

  constructor(private charityApi:CharityApiService,
              private ibgeApi:IbgeApiService,) { }
  
  charities:Array<Charity>;
  States:Array<State>;
  Cities:Array<City>;
  hasSearch = false;
  search = '';
  isLoading = false;

  pagination:Pagination;
  itemsPerPage = 10;
  firstPage = 1

  onHandlePageChange(page){
    this.charityApi.getCharities(page, this.itemsPerPage).then(res => {
      this.charities = <Charity[]>res.Charities;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      console.log(err);    
    });
  }

  onStateChange(value:string){
    this.Cities = [];
    this.ibgeApi.getCities(value).then(res => {
      this.Cities = <City[]>res;
    }).catch(err => {  
      console.log(err);        
    });
  }

  searchCharities(){
    this.isLoading = true;
    
    this.charityApi.getCharities(this.firstPage, this.itemsPerPage, this.search).then(res => {
      this.charities = <Charity[]>res.Charities;
      this.pagination = <Pagination> res.Pagination;
      this.hasSearch = true;
    }).catch(err => {
      console.log(err);    
    }).finally(() => {
      this.isLoading = false;
    });
  }
 
  ngOnInit() {     
    this.ibgeApi.getStates().then(res => {
        this.States = <State[]>res;
    }).catch(err => {   
      console.log(err);     
    });  
   
      // this.charityApi.getCharities(this.firstPage, this.itemsPerPage).then(res => {
      //   this.charities = <Charity[]>res.Charities;
      //   this.pagination = <Pagination> res.Pagination;

      //   this.ibgeApi.getStates().then(res => {
      //     this.States = <State[]>res;
      //   }).catch(err => {   
      //     console.log(err);     
      //   });
      // }).catch(err => {   
      //   console.log(err);         
      // });     
  }
}
