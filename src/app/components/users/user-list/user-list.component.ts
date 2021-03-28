import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user.model';
import { UserApiService } from '../../../services/user-api.service';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  constructor(private userApi:UserApiService) { }
  users:Array<User>;
  pagination:Pagination;
  itemsPerPage = 5;
  firstPage = 1
  txtSearch="";
  isLoading = false;
  search = false;   
  errorMessage:string = '';

  onHandlePageChange(page){
    this.isLoading = true;   
    this.errorMessage = '';

    this.userApi.getUsers(page, this.itemsPerPage, this.txtSearch).then(res => {
      this.users = <User[]>res.Users;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err =>{
      console.log(err);
      this.errorMessage = err;
    }).finally(() => {
      this.isLoading = false;
    }); 
  }

  ngOnInit(): void {
     this.isLoading = true;   
    this.errorMessage = '';

    this.userApi.getUsers(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.users = <User[]>res.Users;
      this.pagination = <Pagination> res.Pagination;  
    }).catch(err =>{
      console.log(err);
      this.errorMessage = err;
    }).finally(() => {
      this.isLoading = false;  
      this.search = true;
    });  
  }

  searchUsers(){
    this.isLoading = true;   
    this.errorMessage = '';
    
    this.userApi.getUsers(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.users = <User[]>res.Users;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err =>{
      console.log(err);
      this.errorMessage = err;
    }).finally(() => {
      this.isLoading = false;
    });  
  }

  TranslateUserType(type:string):string{
    let _type = '';
    switch(type.toUpperCase()){
      case 'ADMINISTRATOR':
        _type = 'Administrador'
        break;
      case 'DONOR_PF':
        _type = 'Doador PF'
        break;
      case 'DONOR_PJ':
        _type = 'Doador PJ'
        break;
      case 'CHARITABLE_ENTITY':
        _type = 'Entidade Beneficente'
        break;
      case 'MANAGER':
        _type = 'Gerente'
        break;
        case 'EXTERNAL':
          _type = 'Provedor Externo'
          break;
       
    }

    return _type;
  }

}