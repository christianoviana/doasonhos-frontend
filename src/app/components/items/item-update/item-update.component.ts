import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '../../../components/groups/group.model';
import { Item } from '../item.model';
import { AlertService } from '../../../services/alert.service';
import { ItemApiService } from '../../../services/item-api.service';
import { GroupApiService } from '../../../services/group-api.service';

@Component({
  selector: 'app-item-update',
  templateUrl: './item-update.component.html',
  styleUrls: ['./item-update.component.css']
})
export class ItemUpdateComponent implements OnInit {
  groups:Array<Group>;
  item:Item = undefined;
  fileUrl: any = undefined;
  file: any = undefined;
  isLoading: boolean;
  imageUpdated:string = '';

  constructor(private route: ActivatedRoute,
              private itemService:ItemApiService,
              private groupService:GroupApiService,
              private alertService:AlertService) { }

  onUpdateItem(updateForm:NgForm){
    if(updateForm.valid){
      this.isLoading = true;
                
      this.itemService.updateItem(this.item).subscribe(() => {  
        this.isLoading = false;           
        this.alertService.success('O item foi atualizado com sucesso.'); 
        window.scroll(0,0);
      }, error=> {     
        this.alertService.error(error);
        this.isLoading = false;
        window.scroll(0,0);
      });       
    }
}

readFile(file:any){
  this.file = file;

  const fileReader = new FileReader();      
  fileReader.onload = (e) => {
    this.fileUrl = e.target.result;

    let data:FormData = new FormData();
    data.append('photo', this.file);

    this.itemService.updateItemImage(this.item.id, data).subscribe(() => {              
      this.imageUpdated = 'Imagem Atualizada';
   }, error=> {     
     this.fileUrl = undefined;            
     this.imageUpdated = 'Erro ao Atualizar Imagem';
   });  
  
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

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');

    this.itemService.getItemById(itemId).subscribe(item => {                  
      this.fileUrl = item.image_url;
      this.item = item;
    }, error=> {    
      this.item = undefined; 
      this.alertService.error(error);
    });   
    
    this.groupService.getGroups(1, 100).then(res => {
      this.groups = <Group[]>res.Groups;
    });
  }

}
