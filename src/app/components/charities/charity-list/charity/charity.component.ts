import { Component, OnInit, Input } from '@angular/core';
import { Charity } from '../../charity.model';
@Component({
  selector: 'app-charity',
  templateUrl: './charity.component.html',
  styleUrls: ['./charity.component.css']
})
export class CharityComponent implements OnInit {

  constructor() { }

  @Input() charity:Charity;

  ngOnInit(): void {
  }

}
