import { Component, OnInit, Input } from '@angular/core';
import { Role } from '../role.model';
import { RoleApiService } from '../../../services/role-api.service';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  constructor(private roleApi:RoleApiService) { }
  roles:Array<Role>;
  pagination:Pagination;
  itemsPerPage = 5;
  firstPage = 1
  selectedRoleToDelete:Role;
  isLoading = false;  
  txtSearch="";
  search = false;   
  errorMessage:string = '';

  onHandlePageChange(page){
    this.isLoading = true;  
    this.errorMessage = ''; 

    this.roleApi.getRoles(page, this.itemsPerPage).then(res => {
      this.roles = <Role[]>res.Roles;
      this.pagination = <Pagination> res.Pagination;
      this.search = true;
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    }).finally(() => {
      this.isLoading = false;
      this.search = true;
    });
  }

  ngOnInit(): void {
    this.isLoading = true;  
    this.errorMessage = ''; 

    this.roleApi.getRoles(this.firstPage, this.itemsPerPage).then(res => {
      this.roles = <Role[]>res.Roles;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    }).finally(() => {
      this.isLoading = false;
      this.search = true;
    });
  }

  setRoleToDelete(role:Role){
    this.selectedRoleToDelete = role;
  }

  deleteRole(role:Role){
      this.isLoading = true;  
      this.errorMessage = ''; 
    
      this.roleApi.deleteRole(role).then(async () => {       
        this.roleApi.getRoles(this.firstPage, this.itemsPerPage).then(res => {
          this.roles = <Role[]>res.Roles;
          this.pagination = <Pagination> res.Pagination;
        }).catch(error => {          
          console.log(error);
          this.errorMessage = error;
        }).finally(() => {
          this.isLoading = false;
        });
      }).catch(err => {
        console.log(err);
        this.errorMessage = err;
      }).finally(() => {
      });
  }

}
