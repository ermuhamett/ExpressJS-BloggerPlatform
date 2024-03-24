import {config} from "dotenv";

config();

export const SETTINGS = {
    PORT: 3003,
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
    POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
    PATH: {
        VIDEOS: "/videos",
        DELETE: "/testing",
        POSTS: '/posts',
        BLOGS: '/blogs'
    }
};
