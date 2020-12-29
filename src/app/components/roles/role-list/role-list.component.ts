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

  onHandlePageChange(page){
    this.roleApi.getRoles(page, this.itemsPerPage).then(res => {
      this.roles = <Role[]>res.Roles;
      this.pagination = <Pagination> res.Pagination;
    });
  }

  ngOnInit(): void {
    this.roleApi.getRoles(this.firstPage, this.itemsPerPage).then(res => {
      this.roles = <Role[]>res.Roles;
      this.pagination = <Pagination> res.Pagination;
    });
  }
}
