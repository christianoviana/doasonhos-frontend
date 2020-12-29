import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../../group.model';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  @Input() group:Group;
  constructor() { }

  ngOnInit(): void {
  }

}
