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
  firstPage = 1

  onHandlePageChange(page){
    this.itemApi.getItems(page, this.itemsPerPage).subscribe(res => {
      this.items = <Item[]>res.Items;
      this.pagination = <Pagination> res.Pagination;
    });
  }

  ngOnInit(): void {
    this.itemApi.getItems(this.firstPage, this.itemsPerPage).subscribe(res => {
      this.items = <Item[]>res.Items;
      
      console.log(this.items[1].image_url);
      this.pagination = <Pagination> res.Pagination;
    });
  }
}

