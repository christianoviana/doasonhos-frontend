import { Role } from '../roles/role.model';

export interface User{
    id,
    login, 
    active,
    type,
    roles:Array<Role>
 }