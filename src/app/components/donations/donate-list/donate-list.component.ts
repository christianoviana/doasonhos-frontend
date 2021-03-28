import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Donate } from '../donate.model';
import { Pagination } from '../../../core/models/pagination.model';
import { AuthApiService } from '../../../services/auth-api.service';
import { DonationApiService } from '../../../services/donation-api.service';
import { window } from 'rxjs/operators';

@Component({
  selector: 'app-donate-list',
  templateUrl: './donate-list.component.html',
  styleUrls: ['./donate-list.component.css']
})
export class DonateListComponent implements OnInit {
  @Input() donations:Array<any> = new Input();
  @Input() pagination:Pagination = new Input();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onItemChange = new EventEmitter<any>();
  
  constructor(private DonationApi:DonationApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {
    console.log(this.donations)
  }

  isCharity():boolean{
    return this.authService.userValue.userType.toLowerCase() === 'charitable_entity';
  }

  onHandlePageChange(page){
    if(this.onPageChange){
      this.onPageChange.emit(page);
    }   
  }

  onItemClicked(donation){ 
    if(this.onItemChange){
      this.onItemChange.emit(donation);
    }   
  }
}
