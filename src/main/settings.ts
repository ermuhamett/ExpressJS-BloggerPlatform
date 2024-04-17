import {config} from "dotenv";

config();

export const SETTINGS = {
    PORT: 3003,
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
    POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
    USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
    AUTH_COLLECTION_NAME: process.env.AUTH_COLLECTION_NAME || '',
    COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    AC_TIME: process.env.AC_TIME || '',
    SMTP_USER:process.env.SMTP_USER || '',
    SMTP_PASSWORD:process.env.SMTP_PASSWORD || '',
    PATH: {
        VIDEOS: "/videos",
        DELETE: "/testing",
        POSTS: '/posts',
        BLOGS: '/blogs',
        USERS: '/users',
        AUTH: '/auth',
        COMMENTS:'/comments'
    }
};
