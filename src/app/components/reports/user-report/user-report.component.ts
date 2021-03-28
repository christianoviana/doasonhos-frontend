import { Component, OnInit } from '@angular/core';
import { ReportApiService } from '../../../services/report-api.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent  implements OnInit {
  isLoading = false;
  searched = false;
  data:any;

  constructor(private reportApi:ReportApiService) { }

  public barChartOptions = {
    responsive: true,
    maintainAspectRatio:true,
    scales: 
    { 
      xAxes: [{}], 
      yAxes: [{
        ticks: {
          beginAtZero: true,
              min:0,
              stepSize:1
          }
      }] 
    },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'end',
      }
    }
  };

  public barChartPlugins = [pluginDataLabels];
  public barChartLabels = ['Entidade Beneficente', 'Doador PF', 'Doador PJ', 'Usuário Externo', 'Inativos'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = {};

  public chartColors: Array<any> = [
    { // first color
      backgroundColor: 'rgba(250, 190, 88, 1)',
      borderColor: 'rgba(250, 190, 88, 1)',
      pointBackgroundColor: 'rgba(250, 190, 88, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(250, 190, 88, 1)'
    }];

  ngOnInit(): void {
    this.isLoading = true;

    this.reportApi.getUsers().then(res => {
      this.data = res;   

      this.barChartData = [
        {data: [this.data.number_charities, this.data.number_donors_pf, this.data.number_donors_pj, this.data.number_external, this.data.number_inactives], label: 'Quantidade de Usuário'}
      ];
      
      this.isLoading = false;
      this.searched = true;
    }).catch(error => {
      console.log(error);   
    }).finally(()=>{
      this.isLoading = false;   
    }); 
  }

  print(){
    var canvas = document.getElementById('canvas') as HTMLCanvasElement
    var dataUrl = canvas.toDataURL(); //attempt to save base64 string to server using this var  

    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Relatório de Usuários</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';
    
    const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
    printWin.document.open();
    printWin.document.write(windowContent); 

    printWin.document.addEventListener('load', function() {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();            
    }, true);
  }
}

