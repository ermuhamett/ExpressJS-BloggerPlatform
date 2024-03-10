import {Request, Response} from "express";
import {BlogOutputType} from "../db/blog-db-type";
import {blogRepository} from "./blogRepository";

export const getBlogsController = async (req: Request, res: Response<BlogOutputType[]>) => {
    const blogs = await blogRepository.getAll()
    res.status(200).json(blogs)
}