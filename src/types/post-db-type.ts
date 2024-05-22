import {ObjectId} from "mongodb";

export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostOutputType={
    id:string,
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
    createdAt:string
}


export type PostDbTypeMongo={
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
    createdAt:string
}
//ctrl+alt+L reformat