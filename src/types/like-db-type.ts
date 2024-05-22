
export enum LikeStatuses {
    NONE = 'None',
    LIKE = 'Like',
    DISLIKE = 'Dislike',
}
export interface ILikeInputModel{
    likeStatus:LikeStatuses
}
export interface ILikeDbModel {
    authorId:string,
    status:LikeStatuses,
    parentId:string,
    createdAt?:Date
}

