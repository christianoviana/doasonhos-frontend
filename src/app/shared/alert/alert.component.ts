import { Component, OnInit, Input } from '@angular/core';
import { Message } from './message.model';
import { AlertService } from '../../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {

  private subscription: Subscription;
  @Input() messages:Array<Message>;

  constructor(private alertService:AlertService) { }

  ngOnInit(): void {
    this.subscription = this.alertService.getMessage().subscribe(message => {
        this.messages =[];
        this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();    
  }
}
