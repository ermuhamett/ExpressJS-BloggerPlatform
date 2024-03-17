import {PostInputModel} from "../src/db/post-db-type";
import {BlogInputModel} from "../src/db/blog-db-type";
import {blogCollection, BlogDbTypeMongo, PostDbTypeMongo} from "../src/db/mongo-db";
import {ObjectId, WithId} from "mongodb";

export const video1: any /*VideoDBType*/ = {
    id: Date.now() + Math.random(),
    title: "t" + Date.now() + Math.random(),
    // author: 'a' + Date.now() + Math.random(),
    // canBeDownloaded: true,
    // minAgeRestriction: null,
    // createdAt: new Date().toISOString(),
    // publicationDate: new Date().toISOString(),
    // availableResolution: [Resolutions.P240],
};


export const blogData: BlogInputModel = {
    name: "new blog",
    description: "description",
    websiteUrl: "https://someurl.com"
}
export const updatedBlogData: BlogInputModel = {
    name: 'Updated Blog',
    description: 'Updated Description',
    websiteUrl: 'https://updatedblog.com'
}

async function createPostData(): Promise<PostInputModel | null> {
    const blog = await blogCollection.findOne();
    if (!blog) {
        return null; // Возвращаем null, если blog не найден
    }
    const blogId: string | null = blog ? blog._id.toString() : null;
    if (blogId === null) {
        return null; // Возвращаем null, если blogId не найден
    }
    return {
        title: 'post title',
        shortDescription: 'description',
        content: 'new post content',
        blogId: blogId
    };
}

export interface IPostData{
    title:string,
    shortDescription:string,
    content:string,
    blogId:string
}
export class PostDataConstructor implements IPostData{
    title:string;
    shortDescription: string;
    content: string;
    blogId:string;
    constructor(blogId:string, postNumber:number) {
        this.title=`${postNumber} post title`;
        this.shortDescription=`${postNumber} description`;
        this.content=`${postNumber} new post content`;
        this.blogId=blogId
    }
}
