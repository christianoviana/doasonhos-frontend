import { Group } from '../../components/groups/group.model';

export interface Item{
    id,
    name, 
    description,
    price,
    image_url,
    group:Group
 }