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

  onHandlePageChange(page){
    this.itemApi.getItems(page, this.itemsPerPage).subscribe(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;
    });
  }

  ngOnInit(): void {
    this.itemApi.getItems(this.firstPage, this.itemsPerPage).subscribe(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;
    });
  }

  setItemToDelete(item:Item){
    this.selectedItemToDelete = item;
  }

  deleteItem(item:Item){
    this.isLoading = true;
   
    try {
      this.itemApi.deleteItem(item).subscribe(() => {
        try {
          this.itemApi.getItems(this.firstPage, this.itemsPerPage).subscribe(res => {
            this.items = <Item[]>res.Items;
            this.pagination = <Pagination> res.Pagination;
            
            this.isLoading = false;
          });
        } catch (error) {        
          this.isLoading = false;
          console.log(error);
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }   
  }
}

