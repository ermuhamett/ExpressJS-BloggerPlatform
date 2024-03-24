import { app } from "../src/main/app";
import { agent } from "supertest";
import {QueryInputType} from "../src/middleware/helper";

export const req = agent(app);

export const queryForBlog: QueryInputType = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    searchNameTerm: 'name'
};

export const queryForPosts:QueryInputType={
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: 'asc',
}
