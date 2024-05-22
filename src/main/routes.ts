import {app} from "./app";
import {Express, Request, Response} from "express";
import {setDB} from "../db/db";
import {videosRouter} from "../videos";
import {postsRouter} from "../posts/posts.router";
import {testingRouter} from "../testing";
import {blogsRouter} from "../blogs/blogs.router";
import {SETTINGS} from "./settings";
import {usersRouter} from "../users/users.router";
import {authRouter} from "../auth/auth.router";
import {commentsRouter} from "../comments/comments.router";
export const addRoutes=(app:Express)=> {
    app.use(SETTINGS.PATH.DELETE, testingRouter)
    app.use(SETTINGS.PATH.VIDEOS, videosRouter)
    app.use(SETTINGS.PATH.BLOGS, blogsRouter)
    app.use(SETTINGS.PATH.POSTS, postsRouter)
    app.use(SETTINGS.PATH.USERS, usersRouter)
    app.use(SETTINGS.PATH.AUTH, authRouter)
    app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
}