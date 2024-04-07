import { app } from "../src/main/app";
import { agent } from "supertest";
import {QueryInputType} from "../src/middleware/helper";
import {PostOutputType} from "../src/types/post-db-type";
import {BlogOutputType} from "../src/types/blog-db-type";
import {IUserOutputModel} from "../src/types/user-db-type";
import {ICommentOutputModel} from "../src/types/comment-db-type";
export const req = agent(app);
const ADMIN_AUTH = 'admin:qwerty';
export const queryForBlog: QueryInputType = {
    pageNumber: 1,
    pageSize: 5,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchNameTerm: 'name'
};
export const queryForPosts:QueryInputType={
    pageNumber: 1,
    pageSize: 5,
    sortBy: 'createdAt',
    sortDirection: 'desc',
}
export const queryForUsers:QueryInputType={
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    searchLoginTerm:'FPdRKtGvCD',
}

export const queryForComments:QueryInputType={
    pageNumber: 1,
    pageSize: 5,
    sortBy: 'createdAt',
    sortDirection: 'desc',
}

export interface IPostData {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
interface IPagination{
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
}
export interface IPaginationPostModel extends IPagination {
    items: PostOutputType[]
}

export interface IPaginationBlogModel extends IPagination{
    items: BlogOutputType[]
}

export interface IPaginationUserModel extends IPagination{
    items:IUserOutputModel[]
}

export interface IPaginationCommentModel extends IPagination{
    items:ICommentOutputModel[]
}

export const getAuthorizationHeader = () => {
    const encodedCredentials = Buffer.from(ADMIN_AUTH).toString('base64');
    return `Basic ${encodedCredentials}`;
};

/*export const getAuthorizationTokenHeader=(token)=>{
    return {
        Authorization: `Bearer ${token}`
    };
}*/