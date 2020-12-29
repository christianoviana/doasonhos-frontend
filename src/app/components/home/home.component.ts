import { Component, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', {static: false}) carousel: any;
  @ViewChild('next', {static: false}) next: any;

  ngAfterViewInit() {
    //this.carousel.nativeElement.click(); 
  }


  constructor() { }
  ngOnDestroy(): void {
  }
  
  ngOnInit(): void {
  }

}
