import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UserApiService } from '../../../services/user-api.service';
import { AlertService } from '../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
  user: User;
  isLoading = false;

  constructor(private route: ActivatedRoute,
              private userApi:UserApiService,  
              private alertService:AlertService) { }

  ngOnInit(): void {
    this.isLoading = true;  
    const id = this.route.snapshot.paramMap.get('id'); 

    this.userApi.getUsersById(id).then(user => {
      this.user = user;
    }).catch(err =>{
      console.log(err);
    }).finally(() => {
      this.isLoading = false;
    }); 
  }

  onUpdateUser(updateForm:NgForm){
    
    if(updateForm.valid){            
      this.isLoading = true;

      this.userApi.updateUser(this.user).then(() => {                
        this.isLoading = false;           
        this.alertService.success('Usuário atualizado com sucesso.'); 
      }).catch(error => {     
        this.alertService.error(error);
      }).finally(() => {
        window.scroll(0,0);        
        this.isLoading = false;
      });      
    }
  }

  TranslateUserType(type:string):string{
    let _type = '';
    switch(type.toUpperCase()){
      case 'ADMINISTRATOR':
        _type = 'Administrador'
        break;
      case 'DONOR_PF':
        _type = 'Doador PF'
        break;
      case 'DONOR_PJ':
        _type = 'Doador PJ'
        break;
      case 'CHARITABLE_ENTITY':
        _type = 'Entidade Beneficente'
        break;
      case 'MANAGER':
        _type = 'Gerente'
        break;
        case 'EXTERNAL':
          _type = 'Provedor Externo'
          break;
       
    }

    return _type;
  }
}
