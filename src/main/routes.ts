import {app} from "./app";
import {Express, Request, Response} from "express";
import {setDB} from "../db/db";
import {videosRouter} from "../videos";
import {postsRouter} from "../posts";
import {testingRouter} from "../testing";
import {blogsRouter} from "../blogs";
import {SETTINGS} from "./settings";

export const addRoutes=(app:Express)=> {
    app.use(SETTINGS.PATH.DELETE, testingRouter)
    app.use(SETTINGS.PATH.VIDEOS, videosRouter)
    app.use(SETTINGS.PATH.BLOGS, blogsRouter)
    app.use(SETTINGS.PATH.POSTS, postsRouter)
}