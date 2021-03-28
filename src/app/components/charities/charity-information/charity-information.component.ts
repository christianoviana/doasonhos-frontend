import { Component, OnInit } from '@angular/core';
import { Charity } from '../charity.model';
import { CharityApproval } from '../charity-approval.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';

@Component({
  selector: 'app-charity-information',
  templateUrl: './charity-information.component.html',
  styleUrls: ['./charity-information.component.css']
})
export class CharityInformationComponent implements OnInit {
  charity:Charity;
  charityApprovals:Array<CharityApproval>;
  firstApproval:CharityApproval;
  isApproved:boolean = false;
  isLoading: boolean;
  
  constructor(private charityApi:CharityApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {
    this.isLoading = true;

    try {
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      this.charityApi.getCharityApproval(id).then(charityApprovals => {
       this.charityApprovals = charityApprovals;
 
       this.firstApproval = this.charityApprovals[0];
       this.isApproved = this.firstApproval.status.toUpperCase() == 'APPROVED';
 
       if(this.isApproved){
           this.charityApi.getCharitiesById(id).then(charity => {
             this.charity = charity;
           }).catch(error => {
             this.isLoading = false
           }).finally(() => {
             this.isLoading = false
           });
       } 
      }).catch(error => {
       this.isLoading = false
      }).finally(() => {
        this.isLoading = false
      });
    } catch (error) {
      console.log(error)
      this.isLoading = false
    }

  }

  getLinkWithProtocol = link => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
  };
}
