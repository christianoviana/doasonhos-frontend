import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { Charity } from '../charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';

@Component({
  selector: 'app-charity-information-create',
  templateUrl: './charity-information-create.component.html',
  styleUrls: ['./charity-information-create.component.css']
})
export class CharityInformationCreateComponent implements OnInit {

  charity:Charity;
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
    const id = this.authService.userValue && this.authService.userValue.ownerId;

    if(id){      
      this.charity = await this.charityApi.getCharitiesRestrictedById(id);
      console.log(this.charity);
      
      if(this.charity.information != null || this.charity.status.toUpperCase() != 'APPROVED'){
        this.router.navigate(['/charities/information']);
      }
    }      
  }

  ngOnInit(): void {
   
  }

  onSaveCharityInfo(charityInfoForm:NgForm){
    if(charityInfoForm.valid){
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      this.isLoading = true;

      let data: FormData = new FormData();
      data.append('nickname', charityInfoForm.value.nickname);
      data.append('about', charityInfoForm.value.about);
      data.append('goal', charityInfoForm.value.goal);
      data.append('manager_description', charityInfoForm.value.manager);
      data.append('transparency_description', charityInfoForm.value.transparency);
      data.append('vision', charityInfoForm.value.vision);
      data.append('mission', charityInfoForm.value.mission);
      data.append('value', charityInfoForm.value.values);
      data.append('title_image01', charityInfoForm.value.titleImage01);
      data.append('title_image02', charityInfoForm.value.titleImage02);
      data.append('site', charityInfoForm.value.siteUrl);
      data.append('picture', this.file);
      data.append('image01', this.fileImageOne);
      data.append('image02', this.fileImageTwo);    
      
      this.charityApi.postCharityInformation(id, data).then(() => {            
        charityInfoForm.reset();
        this.router.navigate(['/charities/information']);
        this.isLoading = false;  
      }).catch(error=> {     
        this.alertService.error(error);
        this.isLoading = false;
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
