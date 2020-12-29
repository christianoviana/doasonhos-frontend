import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { RoleApiService } from '../../../services/role-api.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent implements OnInit {

  isLoading: boolean;

  constructor( private roleService:RoleApiService,
    private alertService:AlertService) { }

  onCreateRole(createForm:NgForm){
    if(createForm.valid){
      this.isLoading = true;

      let role = {id:null, name:createForm.value.name, description:createForm.value.description };
    
      this.roleService.postRole(role).then(() => {            
        createForm.reset();
        this.isLoading = false;           
        this.alertService.success('Cadastro realizado com sucesso.'); 
      }).catch(error => {     
        this.alertService.error(error);
        this.isLoading = false;
      }).finally(() => {
        window.scroll(0,0);
      });
    }

  }

  ngOnInit(): void {
  }

}
