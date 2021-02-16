import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../group.model';
import { GroupApiService } from '../../../services/group-api.service';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  constructor(private groupApi:GroupApiService) { }
  groups:Array<Group>;
  pagination:Pagination;
  itemsPerPage = 5;
  firstPage = 1;  
  selectedGroupToDelete:Group = undefined;
  isLoading = false;

  onHandlePageChange(page){
    this.groupApi.getGroups(page, this.itemsPerPage).then(res => {
      this.groups = <Group[]>res.Groups;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {

    });
  }

  ngOnInit(): void {
    this.groupApi.getGroups(this.firstPage, this.itemsPerPage).then(res => {
      this.groups = <Group[]>res.Groups;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      
    });
  }

  setGroupToDelete(group:Group){
    this.selectedGroupToDelete = group;
  }

  deleteGroup(group:Group){
      this.isLoading = true;   
    
      this.groupApi.deleteGroup(group).then(async () => {       
        let res = await this.groupApi.getGroups(this.firstPage, this.itemsPerPage);
        this.groups = <Group[]>res.Groups;
        this.pagination = <Pagination> res.Pagination;         
      }).catch(err =>  {
      console.log(err);
    }).finally(()=>{      
      this.isLoading = false;
    });   
  }

}
