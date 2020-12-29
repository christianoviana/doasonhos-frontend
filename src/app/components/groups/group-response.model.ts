import { Group } from "./group.model";
import { Pagination } from "../../core/models/pagination.model";

export class GroupResponse{
    Groups:Array<Group>;
    Pagination:Pagination;
}