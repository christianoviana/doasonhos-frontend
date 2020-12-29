import { Charity } from "./charity.model";
import { Pagination } from "../../core/models/pagination.model";

export class CharityResponse{
    Charities:Array<Charity>;
    Pagination:Pagination;
}