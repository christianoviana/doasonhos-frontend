import { Component, OnInit, Input } from '@angular/core';
import { Role } from '../../role.model';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  @Input() role:Role;
  constructor() { }

  ngOnInit(): void {
  }

}
