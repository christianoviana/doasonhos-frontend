import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { GroupApiService } from '../../../services/group-api.service';
import { Group } from '../group.model';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.component.html',
  styleUrls: ['./group-update.component.css']
})

export class GroupUpdateComponent implements OnInit {

  isLoading: boolean;
  group:Group = {id:'', name:'', description:''} ;

  constructor( private groupService:GroupApiService,
    private route: ActivatedRoute,
    private alertService:AlertService) { }  

    onUpdateGroup(updateForm:NgForm){
      if(updateForm.valid){
        this.isLoading = true;
            
        this.groupService.updateGroup(this.group).then(() => {  
          this.isLoading = false;           
          this.alertService.success('O grupo foi atualizado com sucesso.'); 
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

    this.groupService.getGroupsById(groupId).then(group => {              
      this.group = group;
    }).catch(error => {    
      this.group = undefined; 
      this.alertService.error(error);
    });     
  }
}
