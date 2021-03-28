import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { Charity } from '../charity.model';


@Component({
  selector: 'app-charity-detail',
  templateUrl: './charity-detail.component.html',
  styleUrls: ['./charity-detail.component.css']
})
export class CharityDetailComponent implements OnInit {
  charity:Charity;
  isCharityOrManagerUser = false;  
  isLoading = false;

  constructor(private route:ActivatedRoute,
              private charityApi:CharityApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {
    this.isLoading = true;

    try {
      this.isCharityOrManagerUser = this.authService.userValue && (this.authService.userValue.userType.toUpperCase() == 'CHARITABLE_ENTITY' || this.authService.userValue.userType.toUpperCase() == 'MANAGER');
      const id = this.route.snapshot.paramMap.get('id');
 
      this.charityApi.getCharitiesById(id).then(charity => {
       this.charity = charity;
       console.log(this.charity);
      }).catch(error => {
      }).finally(()=>{
        this.isLoading = false;
      });
    } catch (error) {
      this.isLoading = false;
    }   
  }

  getLinkWithProtocol = link => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
  };

}
