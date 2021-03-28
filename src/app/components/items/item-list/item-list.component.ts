import { Component, OnInit } from '@angular/core';
import { Item } from '../item.model';
import { ItemApiService } from '../../../services/item-api.service';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  constructor(private itemApi:ItemApiService) { }
  items:Array<Item>;
  pagination:Pagination;
  itemsPerPage = 5;
  firstPage = 1;
  selectedItemToDelete:Item = undefined;
  isLoading = false;
  search = false;
  txtSearch:string = '';
  errorMessage:string = '';  
  selectedItem:any;


  onHandlePageChange(page){
    this.isLoading = true;
    this.errorMessage = '';
 
    this.itemApi.getItems(page, this.itemsPerPage).then(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;

      this.isLoading = false;
    }).catch(error => {
      console.log(error);     
      this.errorMessage = error;  
    }).finally(()=>{
      this.isLoading = false;     
    }); 
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.itemApi.getItems(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;    

      this.isLoading = false;
    }).catch(error => {
      console.log(error);  
      this.errorMessage = error;   
    }).finally(()=>{
      this.isLoading = false;     
      this.search = true;
    }); 
  }

  setItemToDelete(item:Item){
   console.log(item);
    this.selectedItemToDelete = item;  

    const deleteModal = document.getElementById('deleteModalTrigger');
    deleteModal.click(); 
  }

  setSelectedItem(item:Item){
    this.selectedItem = item;

    const itemDetailsmodal = document.getElementById('detailModalTrigger');
    itemDetailsmodal.click();    
  }

  searchItems(){
    this.isLoading = true;
    this.errorMessage = '';

    this.itemApi.getItems(this.firstPage, this.itemsPerPage, this.txtSearch).then(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;
      this.search = true;

      this.isLoading = false;
    }).catch(error => {
      console.log(error);   
      this.errorMessage = error;
    }).finally(()=>{
      this.isLoading = false;     
    }); 
  }

  deleteItem(item:Item){
    this.isLoading = true;   
    this.errorMessage = '';
  
    this.itemApi.deleteItem(item).then(() => {       
      this.itemApi.getItems(this.firstPage, this.itemsPerPage).then(res => {
        this.items = <Item[]>res.Items;
        this.pagination = <Pagination> res.Pagination;
        
        this.isLoading = false;
      }).catch (error => {      
      console.log(error);
      this.errorMessage = error;
      }).finally(()=>{
        this.isLoading = false;
      })      
  }).catch (error=> {
    this.isLoading = false;
    console.log(error);
  }
    )};
}

