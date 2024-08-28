import {ObjectId} from "mongodb";

export interface ICommentatorInfo {
    userId:string,
    userLogin:string
}

export interface ICommentInputModel {
    content: string
}

export interface ILikeInfo{
    likesCount:number,
    dislikesCount:number,
    myStatus:string
}

export interface ICommentOutputModel extends ICommentInputModel{
    id: string,
   // content: ICommentInputModel,
    commentatorInfo:ICommentatorInfo,
    createdAt:string
    likesInfo:ILikeInfo
}

export interface ICommentDbMongo extends ICommentInputModel {
    postId:string
    //content: ICommentInputModel,
    commentatorInfo:ICommentatorInfo,
    createdAt:string,
    /*likesCount:number
    dislikesCount:number*/
}