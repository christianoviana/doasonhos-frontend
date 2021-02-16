import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-donate-item',
  templateUrl: './donate-item.component.html',
  styleUrls: ['./donate-item.component.css']
})
export class DonateItemComponent implements OnInit {

  @Input() item:any;
  @Output() ItemClickedEvent = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

  onClickItem(item:any){
    this.ItemClickedEvent.emit(item);
  }

}
