import {ObjectId} from "mongodb";

export interface ICommentatorInfo {
    userId:string,
    userLogin:string
}

export interface ICommentInputModel {
    content: string
}

export interface ICommentOutputModel extends ICommentInputModel{
    id: string,
   // content: ICommentInputModel,
    commentatorInfo:ICommentatorInfo,
    createdAt:string
}

export interface ICommentDbMongo extends ICommentInputModel {
    //content: ICommentInputModel,
    commentatorInfo:ICommentatorInfo,
    createdAt:string,
    postId:string
}