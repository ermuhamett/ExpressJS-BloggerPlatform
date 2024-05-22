import {WithId} from "mongodb";
import {BlogDbTypeMongo, BlogOutputType} from "../types/blog-db-type";
import {PostDbTypeMongo, PostOutputType} from "../types/post-db-type";
import {IUserDbMongo, IUserOutputModel} from "../types/user-db-type";
import {ICommentatorInfo, ICommentDbMongo, ICommentOutputModel} from "../types/comment-db-type";
import {ISessionInfo, IUserAccountDbModel} from "../types/auth-db-type";
import {IDeviceViewModel} from "../types/security-db-type";
import {BlogDocument, CommentDocument, PostDocument, SessionDocument, UserDocument} from "../db/mongoose/schemas";
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
export const postMapper=(post: PostDocument):PostOutputType=>{
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt, // Добавляем createdAt
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
export const commentMapper=(comment:CommentDocument):ICommentOutputModel=>{
    return {
        id:comment._id.toString(),
        content: comment.content,
        commentatorInfo:comment.commentatorInfo,
        createdAt:comment.createdAt
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