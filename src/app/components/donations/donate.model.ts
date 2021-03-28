import { Charity } from '../charities/charity.model';

export interface Donate{
    id:string,
    date:string, 
    total:number,
    completed:boolean,
    donation_item:any,
    donor_id:string,
    donor_name:boolean,
    donor_login:string,
    charitable_entity:Charity
}