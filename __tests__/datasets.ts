import {PostInputModel, PostOutputType} from "../src/types/post-db-type";
import {BlogInputModel, BlogOutputType} from "../src/types/blog-db-type";
import {
    IPaginationBlogModel,
    IPaginationCommentModel,
    IPaginationPostModel,
    IPaginationUserModel,
    IPostData
} from "./test-helpers";
import {IUserInputModel, IUserOutputModel} from "../src/types/user-db-type";
import {ICommentInputModel, ICommentOutputModel} from "../src/types/comment-db-type";

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
export const postDataForBlog = {
    title: "Post Title",
    shortDescription: "Short Description",
    content: "Content"
}

export const contentData:ICommentInputModel={
    content:'This post is so realistic and great, i like it'
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

export class UserDataInfo implements IUserInputModel {
    constructor(public login: string, public password: string, public email: string) {
    }
    static createFilledInstance(login: string, password: string, email: string): UserDataInfo {
        return new UserDataInfo(login, password, email);
    }
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
export class PaginationUserView implements IPaginationUserModel{
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: IUserOutputModel[]
    ) {
    }
}
export class PaginationCommentView implements IPaginationCommentModel{
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items:ICommentOutputModel[]
    ) {
    }
}



