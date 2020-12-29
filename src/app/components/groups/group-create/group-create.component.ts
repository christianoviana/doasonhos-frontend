import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { GroupApiService } from '../../../services/group-api.service';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent implements OnInit {
  isLoading: boolean;

  constructor( private groupService:GroupApiService,
    private alertService:AlertService) { }

  onCreateGroup(createForm:NgForm){
    if(createForm.valid){
      this.isLoading = true;

      let group = {id:null, name:createForm.value.name, description:createForm.value.description };
    
      this.groupService.postGroup(group).then(() => {            
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
