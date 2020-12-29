import {Address} from '../../core/models/address.model';
import {CharityInformation} from './charity-information.model';

export interface Charity{
   id:string,
   name:string, 
   cnpj:string,
   representant_name:string,
   cellphone:string,
   telephone:string,
   active:boolean,
   status:string,
   approver:string,
   approver_data:string
   address:Address
   information:CharityInformation
}