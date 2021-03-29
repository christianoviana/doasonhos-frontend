import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from '../../../components/groups/group.model';
import { AlertService } from '../../../services/alert.service';
import { ItemApiService } from '../../../services/item-api.service';
import { GroupApiService } from '../../../services/group-api.service';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css']
})
export class ItemCreateComponent implements OnInit {
  groups:Array<Group>;
  isLoading: boolean;
  fileUrl: any = undefined;
  file: any = undefined;

  constructor( private itemService:ItemApiService,
               private groupService:GroupApiService,
               private alertService:AlertService) { }

    ngOnInit(): void {
      this.groupService.getGroups(1, 100).then(res => {
        this.groups = <Group[]>res.Groups;
      });
    }

    readFile(file:any){
      this.file = file;

      const fileReader = new FileReader();      
      fileReader.onload = (e) => {
        this.fileUrl = e.target.result;
      }

      fileReader.readAsDataURL(file);
    }

    onFileChange(file){
      const image_size = ((file.size/1024) / 1024);

      if(image_size <= 10){
        this.readFile(file);
      }

      console.log(image_size);
    }

    onCreateItem(createForm:NgForm){
      if(createForm.valid){
        this.isLoading = true;

        let data: FormData = new FormData();
        data.append('name', createForm.value.name);
        data.append('description', createForm.value.description);
        data.append('price', createForm.value.price.replace(',', '.'));
        data.append('group_id', createForm.value.groupId);
        data.append('photo', this.file);
      
        this.itemService.postItem(data).subscribe(() => {            
          createForm.reset();
          this.isLoading = false;     
          this.fileUrl = undefined;
          this.file = undefined;
              
          this.alertService.success('Cadastro realizado com sucesso.'); 
          window.scroll(0,0);
        }, error=> {     
          this.alertService.error(error);
          this.isLoading = false;
          window.scroll(0,0);
        });       
      }
    } 
}