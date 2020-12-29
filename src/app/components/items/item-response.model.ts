import { Item } from "./item.model";
import { Pagination } from "../../core/models/pagination.model";

export class ItemResponse{
    Items:Array<Item>;
    Pagination:Pagination;
}