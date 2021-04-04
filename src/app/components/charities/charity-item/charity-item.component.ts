import { Component, OnInit, ElementRef, ViewChildren  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { GroupApiService } from '../../../services/group-api.service';
import { CharityApiService } from '../../../services/charity-api.service';
import { AuthApiService } from '../../../services/auth-api.service';
import { iif } from 'rxjs';

@Component({
  selector: 'app-charity-item',
  templateUrl: './charity-item.component.html',
  styleUrls: ['./charity-item.component.css']
})
export class CharityItemComponent implements OnInit {
  @ViewChildren('lstItems') lstItems;
  isLoading: boolean;
  groupItems: any;
  filteredItems: any =[];
  myItems:Array<any>=[] = new Array<any>();
  hasChanged=false;
  
  constructor(private groupService:GroupApiService,
              private charityService:CharityApiService,
              private alertService:AlertService,
              private authService:AuthApiService,
              private elRef:ElementRef) { }     

              
  async ngOnInit():Promise<void> {
    this.isLoading = true;

    try {
      const id = this.authService.userValue && this.authService.userValue.ownerId;

      const [groupItems, items] = await Promise.all([this.groupService.getGroupsItems(), this.charityService.getCharityItems(id)]);
           
      this.groupItems = groupItems && groupItems.filter(e => e.items.length > 0);  
        
      items.forEach(item => {
        this.myItems.push({id:item.id, name:item.name, price:item.price, group:item.group.name})
      });

      if(this.myItems){
        this.myItems = this.myItems.sort((a, b) => a.name.localeCompare(b.name));
      }

      //Initialize First Filtered Items
      let ArrayItems = this.groupItems.map(e => {
        return e.items;
      });

      this.filteredItems = ArrayItems && ArrayItems.reduce((acc, val) => acc.concat(val), []);  

      if( this.filteredItems){
        this.filteredItems = this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      }

    } catch (error) {
      console.log(error);
    }finally{      
       this.isLoading = false 
    }  
  }

  ngAfterViewInit() {
    this.lstItems.changes.subscribe(() => { 
      let timeoutId = setTimeout(()=>{
        this.FillCheckItems(this.myItems);
        clearTimeout(timeoutId);
      }, 150);   
    });
  }

  onSaveCharityItem(charityItemForm:NgForm){
    if(charityItemForm.valid){
      const id = this.authService.userValue && this.authService.userValue.ownerId;
      const itemsObj = {items:this.myItems.map(e => e.id)};

      this.isLoading = true;
      
      this.charityService.putCharityItem(id, itemsObj).then(() => {
        this.alertService.success('Os items foram cadastrados com sucesso.');  
      }).catch(error=> {     
        this.alertService.error(error);
      }).finally(() =>
      { 
        this.isLoading = false;
        window.scroll(0, 0);
      });       
    }
  }

  onChangeTypeSearch(value:any){   
    this.filteredItems = [];
    this.onAllItems(false);

    if(value == 'name'){
      let ArrayItems = this.groupItems.map(e => {
          return e.items;
      });

      if(ArrayItems){
        this.filteredItems = ArrayItems.reduce((acc, val) => acc.concat(val), []);
        this.filteredItems = [].concat(this.filteredItems); 

        this.filteredItems = this.filteredItems && this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      } 
    }
  }

  onAllItems(checked:boolean){
    var list = this.elRef.nativeElement.querySelectorAll('.chk-item, .chk-all-item');
  
    list.forEach(e => e.checked=checked);
  }

  FillCheckItems(items:any){

    var list = this.elRef.nativeElement.querySelectorAll('.chk-item');

    if(list){
      list.forEach(item => {
        items.forEach(myItem => {
          if(item.id == myItem.id)
            item.checked=true;     
        })    
      });
    }   
  }

  onCheckItems(target:any){
    if(target.checked == false){
      this.myItems = this.myItems.filter(e => e.id != target.id);
    }
    else{
      if(this.myItems && !this.myItems.find(i => i.id == target.id)){     
        let item = this.filteredItems.find(i => i.id == target.id);
        let group = this.groupItems.find(g => g.items && g.items.find(gr => gr.id == target.id))
        
        this.myItems.push({id:item.id, name:item.name, price:item.price, group:group.name})
        this.myItems = this.myItems.sort((a, b) => a.name.localeCompare(b.name));
      }   
    }   
  }

  onSearch(text:string){
    this.filteredItems = [];
    this.onAllItems(false);

    if(this.groupItems){      
      let ArrayItems = this.groupItems.map(e => {
        return e.items.filter(e => e.name.toLowerCase().includes(text.toLowerCase()));
      });
      
      if(ArrayItems){
        this.filteredItems = ArrayItems.reduce((acc, val) => acc.concat(val), []);

        this.filteredItems = this.filteredItems && this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      }   
    }                         
  }

  onChangeGroup(id:any){
    this.filteredItems = [];
    this.onAllItems(false);

    if(this.groupItems){    
      let group = this.groupItems.find(e => e.id == id);
      this.filteredItems = [].concat(group.items);
      this.filteredItems = this.filteredItems && this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}
