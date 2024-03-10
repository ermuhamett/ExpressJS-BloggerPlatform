import {app} from "./app";
import {Express, Request, Response} from "express";
import {setDB} from "../db/db";
import {videosRouter} from "../videos";
import {postsRouter} from "../posts";
import {testingRouter} from "../testing";
import {blogsRouter} from "../blogs";

export const PATH={
    VIDEOS: "/videos",
    DELETE: "/testing",
    POSTS:'/posts',
    BLOGS:'/blogs'
}

export const addRoutes=(app:Express)=> {
    app.use(PATH.DELETE, testingRouter)
    app.use(PATH.VIDEOS, videosRouter)
    app.use(PATH.BLOGS, blogsRouter)
    app.use(PATH.POSTS, postsRouter)
}