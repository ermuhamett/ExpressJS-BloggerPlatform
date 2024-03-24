import {PostInputModel, PostOutputType} from "../src/db/post-db-type";
import {BlogInputModel, BlogOutputType} from "../src/db/blog-db-type";

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

export const postDataForBlog={
    title: "Post Title",
    shortDescription: "Short Description",
    content: "Content"
}

export interface IPostData {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export class PostDataConstructor implements IPostData {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;

    constructor(blogId: string, postNumber: number) {
        this.title = `${postNumber} post title`;
        this.shortDescription = `${postNumber} description`;
        this.content = `${postNumber} new post content`;
        this.blogId = blogId
    }
}

export interface IPaginationPostModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostOutputType[]
}

export interface IPaginationBlogModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BlogOutputType[]
}

export class PaginationPostView implements IPaginationPostModel {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: PostOutputType[]
    ) {
    }
}
export class PaginationBlogView implements IPaginationBlogModel {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: BlogOutputType[]
    ) {
    }
}