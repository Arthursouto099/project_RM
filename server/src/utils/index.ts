import { Pagination } from "../interfaces/Pagination";



export function getSkipQuantity(objectPagination: Pagination)  {
    return (objectPagination.page - 1 ) * objectPagination.limit 
}