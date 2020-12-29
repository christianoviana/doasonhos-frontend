import {Charity} from './../../charities/charity.model';

export interface PendingCharities{
    state:string;
    charities:Array<Charity>;
}