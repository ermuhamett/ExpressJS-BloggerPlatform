import {WithId} from "mongodb";
import {BlogDbTypeMongo, PostDbTypeMongo} from "../db/mongo-db";
import {BlogOutputType} from "../db/blog-db-type";
import {PostOutputType} from "../db/post-db-type";
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