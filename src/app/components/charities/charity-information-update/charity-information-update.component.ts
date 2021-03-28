import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { Charity } from '../charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { CharityInformation } from '../charity-information.model';

@Component({
  selector: 'app-charity-information-update',
  templateUrl: './charity-information-update.component.html',
  styleUrls: ['./charity-information-update.component.css']
})
export class CharityInformationUpdateComponent implements OnInit {
  charity:Charity;
  charityInfo:CharityInformation;
  isLoading: boolean;
  fileUrl: any = undefined;
  file: any = undefined;

  imageOneUrl: any = undefined;
  fileImageOne: any = undefined;

  imageTwoUrl: any = undefined;
  fileImageTwo: any = undefined;

  constructor(private charityApi:CharityApiService,
              private alertService:AlertService,
              private authService:AuthApiService,
              private router: Router) { }

  async ngAfterViewInit() {
    
  }

  async ngOnInit() {
    this.isLoading = true;

    try {
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      if(id){      
        this.charity = await this.charityApi.getCharitiesRestrictedById(id);

        if(this.charity != null && this.charity != undefined){
          this.charityInfo = this.charity.information;
        
          if(this.charity.information == null && this.charity.status.toUpperCase() == 'APPROVED'){
            this.router.navigate(['/charities/information/create']);
          }
          else if(this.charity.information != null && this.charity.status.toUpperCase() != 'APPROVED'){
            this.router.navigate(['/charities/information']);
          }

          this.fileUrl = this.charityInfo.picture_url;
          this.imageOneUrl = this.charityInfo.image01_url;
          this.imageTwoUrl = this.charityInfo.image02_url;                  
        }   
      }      
    } catch (error) {
      
    }finally{
      this.isLoading = false;
    }
    
  }

  onSaveCharityInfo(charityInfoForm:NgForm){
    if(charityInfoForm.valid){
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      this.isLoading = true;

      let data = {
        'nickname':charityInfoForm.value.nickname,
        'about':charityInfoForm.value.about,
        'goal':charityInfoForm.value.goal,
        'manager_description':charityInfoForm.value.manager,
        'transparency_description':charityInfoForm.value.transparency,
        'vision':charityInfoForm.value.vision,
        'mission':charityInfoForm.value.mission,
        'value':charityInfoForm.value.values,
        'title_image01':charityInfoForm.value.titleImage01,
        'title_image02':charityInfoForm.value.titleImage02,
        'site':charityInfoForm.value.siteUrl
      };      
      
      this.charityApi.putCharityInformation(id, data).then(() => {   
        this.alertService.success('Cadastro atualizado com sucesso.');
        this.isLoading = false;  
      }).catch(error=> {     
        this.alertService.error(error);
        this.isLoading = false;
      }).finally(() => {
        window.scroll(0, 0);
      });       
    }
  } 

  readFile(file:any, onLoadCalback:any){
   
    const fileReader = new FileReader();      
    fileReader.onload = (e) => {
      onLoadCalback(e.target.result);
      //this.fileUrl = e.target.result;
    }

    fileReader.readAsDataURL(file);
  }

  onFileChange(file, type){
    const image_size = ((file.size/1024) / 1024);

    if(image_size <= 10){
      this.readFile(file, (fileUrl) => {

        switch(type){
          case 'profile':
            this.fileUrl = fileUrl;
            this.file = file;
          break;
          case 'image01':
            this.imageOneUrl = fileUrl;
            this.fileImageOne = file;
          break;
          case 'image02':
            this.imageTwoUrl = fileUrl;
            this.fileImageTwo = file;
          break;
        }
      });
    }
  }
}
