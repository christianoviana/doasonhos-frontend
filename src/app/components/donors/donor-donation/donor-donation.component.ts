import { Component, OnInit } from '@angular/core';
import { DonationApiService } from '../../../services/donation-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-donor-donation',
  templateUrl: './donor-donation.component.html',
  styleUrls: ['./donor-donation.component.css']
})
export class DonorDonationComponent implements OnInit {
  donations:Array<any>;
  pagination:Pagination;
  itemsPerPage = 8;
  firstPage = 1;
  isLoading = false;
  selectedDonation:any;

  onHandlePageChange(page){
    this.isLoading = true;

    const donorId = this.authService.userValue.userId;
    this.DonationApi.getDonorsDonation(donorId, page, this.itemsPerPage).then((res) => {     
      this.donations = res.Donations;
      this.pagination = <Pagination> res.Pagination;
    }).catch((error => {
      console.log(error);
    })).finally(() => {
      this.isLoading = false;
    });
  }

  onItemChange(donation){
    this.selectedDonation = donation;

    const itemDetailsmodal = document.getElementById('modalTrigger');
    itemDetailsmodal.click();    
  }

  cancel(donation){
    this.isLoading = true;
    
    const donorId = this.authService.userValue.userId;
    
    this.DonationApi.CancelDonationPresencial(donation.id).then((res) => {

      this.DonationApi.getDonorsDonation(donorId, this.firstPage, this.itemsPerPage).then((res) => {
        this.donations = res.Donations;
        this.pagination = <Pagination> res.Pagination;
      }).catch((error => {
        console.log(error);        
        this.isLoading = false;
      })).finally(() => {
        this.isLoading = false;
      });
    }).catch((error => {
      console.log(error);
      this.isLoading = false;
    })).finally(() => {
    });
  }

  constructor(private DonationApi:DonationApiService,
              private authService:AuthApiService) { }

  ngOnInit(): void {
    this.isLoading = true;
    
    const donorId = this.authService.userValue.userId;

    this.DonationApi.getDonorsDonation(donorId, this.firstPage, this.itemsPerPage).then((res) => {
      this.donations = res.Donations;
      this.pagination = <Pagination> res.Pagination;
    }).catch((error => {
      console.log(error);
    })).finally(() => {
      this.isLoading = false;
    });
  }
}
