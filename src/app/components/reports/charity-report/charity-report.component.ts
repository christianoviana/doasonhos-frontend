import { Component, OnInit } from '@angular/core';
import { Charity } from '../../../components/charities/charity.model';
import { CharityApiService } from '../../../services/charity-api.service';
import { Pagination } from '../../../core/models/pagination.model';
import { ReportApiService } from '../../../services/report-api.service';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-charity-report',
  templateUrl: './charity-report.component.html',
  styleUrls: ['./charity-report.component.css']
})
export class CharityReportComponent implements OnInit {
  charities:Array<Charity>; 
  selectedCharity:Charity; 
  isLoading = false;
  reportData:any = null;
  begin_date= new Date().toISOString().slice(0, 10);
  end_date=new Date().toISOString().slice(0, 10);


  search = '';
  hasSearch=false;
  pagination:Pagination;
  itemsPerPage = 6;
  firstPage = 1

   // Pie
   public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          // const label = ctx.chart.data.labels[value];         
          return value;
        },
      },
    }
  };

  public pieChartOptionsTotal: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          var money = value.toFixed(2).toLocaleString('pt-Br',  { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' });
          const label = "R$ " + money;
          return label;
        },
      },
    }
  };

  public pieChartLabelsItem: Label[] = [['Online'], ['Presencial']];
  public pieChartDataItem: number[] = [];

  public pieChartLabelsTotal: Label[] = [['Dinheiro'], ['Itens Online']];
  public pieChartDataTotal: number[] = [];

  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(255,0,0,0.3)'],
    },
  ];

  public pieChartColorsItems = [
    {
      backgroundColor: ['rgba(0,255,125,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];


  constructor(private charityApi:CharityApiService,
              private reportApi:ReportApiService) { }

  ngOnInit(): void {
    this.isLoading = true;
    
    this.charityApi.getCharitiesWithoutStore(this.firstPage, this.itemsPerPage, this.search).then(res => {
      this.charities = <Charity[]>res.Charities;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      console.log(err);    
    }).finally(() => {
      this.isLoading = false;
      this.hasSearch = true;
    });
  }

  onCharityChange(charity){
    this.isLoading = true;

    this.reportApi.getCharities(charity.id, this.begin_date, this.end_date).then(res => {
      this.reportData = res; 
console.log(res);

      this.pieChartDataItem = [res.total_online_items, res.total_presential_items];
      this.pieChartDataTotal = [res.donations_value, res.items_value];
     
      
      this.isLoading = false;
    }).catch(error => {
      console.log(error);   
    }).finally(()=>{
      this.isLoading = false;   
    }); 
  }

  onHandlePageChange(page){
    this.charityApi.getCharitiesWithoutStore(page, this.itemsPerPage, this.search).then(res => {
      this.charities = <Charity[]>res.Charities;
      this.pagination = <Pagination> res.Pagination;
     
    }).catch(err => {
      console.log(err);    
    });
  }

  searchCharities(){
    this.isLoading = true;
    
    this.charityApi.getCharitiesWithoutStore(this.firstPage, this.itemsPerPage, this.search).then(res => {
      this.charities = <Charity[]>res.Charities;
      this.pagination = <Pagination> res.Pagination;
    }).catch(err => {
      console.log(err);    
    }).finally(() => {
      this.isLoading = false;
      this.hasSearch = true;
    });
  }

}
