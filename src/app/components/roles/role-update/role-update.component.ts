import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { RoleApiService } from '../../../services/role-api.service';
import { Role } from '../role.model';

@Component({
  selector: 'app-role-update',
  templateUrl: './role-update.component.html',
  styleUrls: ['./role-update.component.css']
})
export class RoleUpdateComponent implements OnInit {

  isLoading: boolean;
  role:Role = {id:'', name:'', description:''} ;

  constructor( private roleService:RoleApiService,
    private route: ActivatedRoute,
    private alertService:AlertService) { }  

    onUpdateRole(updateForm:NgForm){
      if(updateForm.valid){
        this.isLoading = true;
            
        this.roleService.updateRole(this.role).then(() => {  
          this.isLoading = false;           
          this.alertService.success('A regra de acesso foi atualizada com sucesso.'); 
        }).catch(error => {     
          this.alertService.error(error);
          this.isLoading = false;
        }).finally(() => {
          window.scroll(0,0);
        });      
      }
  }

  ngOnInit(): void {
    const groupId = this.route.snapshot.paramMap.get('id');

    this.roleService.getRolesById(groupId).then(role => {              
      this.role = role;
    }).catch(error => {    
      this.role = undefined; 
      this.alertService.error(error);
    });     
  }
}
