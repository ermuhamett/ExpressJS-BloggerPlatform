import {WithId} from "mongodb";
import {BlogDbTypeMongo, BlogOutputType} from "../db/blog-db-type";
import {PostDbTypeMongo, PostOutputType} from "../db/post-db-type";
import {IUserDbMongo, IUserOutputModel} from "../db/user-db-type";
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

export const userMapper=(user:WithId<IUserDbMongo>):IUserOutputModel=>{
    return {
        id:user._id,
        login:user.login,
        email:user.email,
        createdAt:user.createdAt
    }
}