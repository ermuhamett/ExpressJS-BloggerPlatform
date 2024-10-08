import {ObjectId} from "mongodb";

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogOutputType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}

export type BlogDbTypeMongo={
    //_id: ObjectId
    name: string
    description: string
    websiteUrl: string
    createdAt:string
    isMembership:boolean
}


