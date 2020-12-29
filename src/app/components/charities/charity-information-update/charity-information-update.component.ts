import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { CharityApiService } from '../../../services/charity-api.service';
import { GroupApiService } from '../../../services/group-api.service';

@Component({
  selector: 'app-charity-information-update',
  templateUrl: './charity-information-update.component.html',
  styleUrls: ['./charity-information-update.component.css']
})
export class CharityInformationUpdateComponent implements OnInit {
  isLoading: boolean;
  fileUrl: any = undefined;
  file: any = undefined;
  groupItems:Array<any>;

  constructor(private charityApi:CharityApiService,
             private groupApi:GroupApiService,
              private alertService:AlertService) { }

  ngOnInit(): void {
    this.groupApi.getGroupsItems().then(groupItems => {
      this.groupItems = groupItems;
      console.log(this.groupItems);
     }).catch(error => {
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

  onSaveCharityInfo(charityInfoForm:NgForm){
    if(charityInfoForm.valid){
      this.isLoading = true;

      // let data: FormData = new FormData();
      // data.append('name', createForm.value.name);
      // data.append('description', createForm.value.description);
      // data.append('price', createForm.value.price);
      // data.append('group_id', createForm.value.groupId);
      // data.append('photo', this.file);
    
      // this.charityService.postCharity({}).then(() => {            
      //   createForm.reset();
      //   this.isLoading = false;     
      //   this.fileUrl = undefined;
      //   this.file = undefined;
            
      //   this.alertService.success('Cadastro realizado com sucesso.'); 
      // }).catch(error=> {     
      //   this.alertService.error(error);
      //   this.isLoading = false;
      // });       
    }
  } 
}
