import {BlogOutputType} from "../types/blog-db-type";
import {IExtendedLikesInfo, INewestLikeInfo, IPostLikeModel, PostOutputType} from "../types/post-db-type";
import {IUserOutputModel} from "../types/user-db-type";
import {ICommentOutputModel, ILikeInfo} from "../types/comment-db-type";
import {IDeviceViewModel} from "../types/security-db-type";
import {BlogDocument, CommentDocument, PostDocument, SessionDocument, UserDocument} from "../db/mongoose/schemas";
import {ILikeDbModel, LikeStatuses} from "../types/like-db-type";

export const blogMapper=(blog: BlogDocument):BlogOutputType=>{
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership:blog.isMembership
    };
}
export const postMapper=(post: PostDocument, likes:IExtendedLikesInfo):PostOutputType=>{
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt, // Добавляем createdAt,
        extendedLikesInfo:likes
    };
}
export const userMapper=(user:UserDocument):IUserOutputModel=>{
    return {
        id:user._id.toString(),
        login:user.login,
        email:user.email,
        createdAt:user.createdAt
    }
}
export const commentMapper=(comment:CommentDocument, likesInfo: ILikeInfo):ICommentOutputModel=>{
    return {
        id:comment._id.toString(),
        content: comment.content,
        commentatorInfo:comment.commentatorInfo,
        createdAt:comment.createdAt,
        likesInfo:likesInfo
    }
}

export const deviceMapper=(authSession:SessionDocument):IDeviceViewModel=>{
    return {
        ip:authSession.ip,
        title:authSession.deviceName,
        lastActiveDate:new Date(authSession.createdAt).toISOString(),
        deviceId:authSession.deviceId
    }
}

export const newestLikesMapper=(like:IPostLikeModel):INewestLikeInfo=>{
    return {
        addedAt:like.addedAt,
        userId:like.likedUserId,
        login:like.likedUserLogin
    }
}