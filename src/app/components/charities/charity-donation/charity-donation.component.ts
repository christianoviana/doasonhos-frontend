import { Component, OnInit } from '@angular/core';
import { DonationApiService } from '../../../services/donation-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { Pagination } from '../../../core/models/pagination.model';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-charity-donation',
  templateUrl: './charity-donation.component.html',
  styleUrls: ['./charity-donation.component.css']
})
export class CharityDonationComponent implements OnInit {

  donations:Array<any>;
  pagination:Pagination;
  itemsPerPage = 8;
  firstPage = 1;
  isLoading = false;
  selectedDonation:any;
  hasSearch = false;

  onHandlePageChange(page){
    this.isLoading = true;

    const charityId = this.authService.userValue.ownerId;
    this.DonationApi.getCharitiesDonation(charityId, page, this.itemsPerPage).then((res) => {     
      this.donations = res.Donations;
      this.pagination = <Pagination> res.Pagination;
    }).catch((error => {
      console.log(error);
    })).finally(() => {
      this.isLoading = false;
    });
  }

  ExportToCsv(){
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
   
    const csvExporter = new ExportToCsv(options); 
    let donationCsv:Array<any>=[];
       

    this.donations.forEach(donation => {
      let items = '';
      
      donation.items.forEach(item => {
        items+=item.name + '(R$: ' + item.price + ' - ' + item.quantity + 'x); '; 
      });

      donationCsv.push({id:donation.id, data:donation.date, total:donation.total, concluido:donation.completed==true?'Sim':'Nao', cancelado:donation.canceled==true?'Sim':'Nao', items:items});
    });

    console.log(donationCsv);
    
    csvExporter.generateCsv(donationCsv);
  }

  onItemChange(donation){
    this.selectedDonation = donation;

    const itemDetailsmodal = document.getElementById('modalTrigger');
    itemDetailsmodal.click();    
  }

  cancel(donation){
    this.isLoading = true;
    
    const charityId = this.authService.userValue.ownerId;
    
    this.DonationApi.CancelDonationPresencial(donation.id).then((res) => {
      this.donations = null;
      this.hasSearch = false;

      this.DonationApi.getCharitiesDonation(charityId, this.firstPage, this.itemsPerPage).then((res) => {
        this.donations = res.Donations;
        this.pagination = <Pagination> res.Pagination;
      }).catch((error => {
        console.log(error);        
        this.isLoading = false;
      })).finally(() => {
        this.hasSearch = true;
        this.isLoading = false;
      });
    }).catch((error => {
      console.log(error);
      this.isLoading = false;
    })).finally(() => {
    });
  }

  
  approve(donation){
    this.isLoading = true;
    const charityId = this.authService.userValue.ownerId;
    
    this.DonationApi.ApproveDonationPresencial(donation.id).then((res) => {
      this.donations = null;
      this.hasSearch = false;
      
      this.DonationApi.getCharitiesDonation(charityId, this.firstPage, this.itemsPerPage).then((res) => {
        this.donations = res.Donations;
        this.pagination = <Pagination> res.Pagination;
      }).catch((error => {
        console.log(error);        
        this.isLoading = false;
      })).finally(() => {
        this.hasSearch = true;
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
    
    const charityId = this.authService.userValue.ownerId;

    this.DonationApi.getCharitiesDonation(charityId, this.firstPage, this.itemsPerPage).then((res) => {
      this.donations = res.Donations;
      this.pagination = <Pagination> res.Pagination;
    }).catch((error => {
      console.log(error);
    })).finally(() => {
      this.hasSearch = true;
      this.isLoading = false;
    });
  }
}
