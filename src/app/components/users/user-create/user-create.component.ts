import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { UserApiService } from '../../../services/user-api.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  isLoading: boolean;

  constructor(private userService:UserApiService,
    private alertService:AlertService) { }

  onCreateUser(createForm:NgForm){
    if(createForm.valid){
      this.isLoading = true;

      let user = {id:null, login:createForm.value.login, password:createForm.value.password, type:'MANAGER' };
    
      this.userService.postUser(user).then(() => {            
        createForm.reset();
        this.isLoading = false;           
        this.alertService.success('Gerente cadastrado com sucesso.'); 
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
