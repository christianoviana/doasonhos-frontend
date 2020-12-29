import { Role } from "./role.model";
import { Pagination } from "../../core/models/pagination.model";

export class RoleResponse{
    Roles:Array<Role>;
    Pagination:Pagination;
}