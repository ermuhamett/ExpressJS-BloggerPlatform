import {ObjectId} from "mongodb";
import {LikeStatuses} from "./like-db-type";

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
    createdAt:string,
    extendedLikesInfo:IExtendedLikesInfo
}


export type PostDbTypeMongo={
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
    createdAt:string
}

export interface IPostLikeModel{
    postId:string,
    likedUserId:string,
    likedUserLogin:string,
    addedAt:string,
    status:LikeStatuses
}

export interface INewestLikeInfo{
    addedAt:string,
    userId:string,
    login:string
}

export interface IExtendedLikesInfo{
    likesCount:number,
    dislikesCount:number,
    myStatus:LikeStatuses,
    newestLikes:Array<INewestLikeInfo>
}
//ctrl+alt+L reformat