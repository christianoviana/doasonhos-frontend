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

  selectedGroup: Group;
  groups:Array<Group>;
  pagination:Pagination;
  itemsPerPage = 5;
  firstPage = 1;  
  selectedGroupToDelete:Group = undefined;
  isLoading = false; 
  search = false;   
  txtSearch:string = '';
  errorMessage:string = '';

  onHandlePageChange(page){    
    this.isLoading = true;   
    this.errorMessage = '';

    this.groupApi.getGroups(page, this.itemsPerPage, this.txtSearch).then(res => {
      this.groups = <Group[]>res.Groups;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    }).finally(()=>{
      this.isLoading = false;
    });
  }

  ngOnInit(): void {    
    this.isLoading = true;   
    this.errorMessage = '';

    this.groupApi.getGroups(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.groups = <Group[]>res.Groups;
      this.pagination = <Pagination> res.Pagination;
      this.search = true;
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    }).finally(()=>{
      this.isLoading = false;
      this.search = true;
    });
  }

  setGroupToDelete(group:Group){
    this.selectedGroupToDelete = group;

    const deleteModal = document.getElementById('deleteModalTrigger');
    deleteModal.click(); 
  }

  setSelectedGroup(group:Group){
    this.selectedGroup = group;

    const itemDetailsmodal = document.getElementById('detailModalTrigger');
    itemDetailsmodal.click();    
  }

  searchGroups(){    
    this.isLoading = true;   
    this.errorMessage = '';

    this.groupApi.getGroups(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.groups = <Group[]>res.Groups;
      this.pagination = <Pagination> res.Pagination;
      this.search = true;
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    }).finally(()=>{
      this.isLoading = false;
    });
  }

  deleteGroup(group:Group){     
    this.isLoading = true;   
    this.errorMessage = '';
    
      this.groupApi.deleteGroup(group).then(async () => {       
        let res = await this.groupApi.getGroups(this.firstPage, this.itemsPerPage, this.txtSearch);
        this.groups = <Group[]>res.Groups;
        this.pagination = <Pagination> res.Pagination;         
      }).catch(err =>  {
        console.log(err);
        this.errorMessage = err;
    }).finally(()=>{      
      this.isLoading = false;
    });   
  }

}
