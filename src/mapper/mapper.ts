import {WithId} from "mongodb";
import {BlogDbTypeMongo, BlogOutputType} from "../types/blog-db-type";
import {PostDbTypeMongo, PostOutputType} from "../types/post-db-type";
import {IUserDbMongo, IUserOutputModel} from "../types/user-db-type";
import {ICommentatorInfo, ICommentDbMongo, ICommentOutputModel} from "../types/comment-db-type";
import {IUserAccountDbModel} from "../types/auth-db-type";
export const blogMapper=(blog: WithId<BlogDbTypeMongo>):BlogOutputType=>{
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt, // Добавляем createdAt
        isMembership:blog.isMembership
    };
}
export const postMapper=(post: WithId<PostDbTypeMongo>):PostOutputType=>{
    return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt, // Добавляем createdAt
    };
}

export const userMapper=(user:WithId<IUserAccountDbModel>):IUserOutputModel=>{
    return {
        id:user._id,
        login:user.login,
        email:user.email,
        createdAt:user.createdAt
    }
}

export const commentMapper=(comment:WithId<ICommentDbMongo>):ICommentOutputModel=>{
    return {
        id:comment._id,
        content: comment.content,
        commentatorInfo:comment.commentatorInfo,
        createdAt:comment.createdAt
    }
}