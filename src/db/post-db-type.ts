import {ObjectId} from "mongodb";

export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type PostOutputType={
    id:ObjectId,
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
    createdAt:string
}


export type PostDbType={
    //id:number,
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
    createdAt:string
}
//ctrl+alt+L reformat