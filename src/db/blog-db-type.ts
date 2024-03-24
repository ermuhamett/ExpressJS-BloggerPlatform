import {ObjectId} from "mongodb";

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogOutputType = {
    id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}

export type BlogDbType={
    //id: number
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}

export type QueryBlogRequestType={
    pageNumber?:number
    pageSize?:number
    sortBy?:string
    sortDirection?:'asc' | 'desc'
    searchNameTerm?:string | null
}

export type SortBlogRepositoryType = {
    sortBy: string
    sortDirection: "asc" | "desc"
    pageNumber: number
    pageSize: number
}
