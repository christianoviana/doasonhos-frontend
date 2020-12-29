import { User } from "./user.model";
import { Pagination } from "../../core/models/pagination.model";

export class UserResponse{
    Users:Array<User>;
    Pagination:Pagination;
}