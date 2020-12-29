export class Pagination{ 
    CurrentPage:number;  
    PageSize:number;  
    TotalPages:number;
    TotalCount:number;
    HasNext:boolean;
    HasPrevious:boolean;

    FirstPage:string;   
    NextPage:string;
    PreviousPage:string;
    LastPage:string;   

    constructor(pagination:any) {
        this.CurrentPage = pagination.current_page;
        this.TotalCount = pagination.total_count;
        this.PageSize = pagination.page_size;
        this.TotalPages = pagination.total_pages;
        this.HasNext = pagination.has_next_page;
        this.HasPrevious = pagination.has_previous_page;

        this.FirstPage = pagination.links.first_page;
        this.LastPage = pagination.links.last_page;
        this.NextPage = pagination.links.next_page;
        this.PreviousPage = pagination.links.previous_page;
    }
}