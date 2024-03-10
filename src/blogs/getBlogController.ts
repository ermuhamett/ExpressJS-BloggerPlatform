import {Request,Response} from "express";
import {BlogOutputType} from "../db/blog-db-type";
import {blogRepository} from "./blogRepository";

export const getBlogController = async(req:Request<{id:string}>,res:Response<BlogOutputType>) => {
    const blog=await blogRepository.findForOutput(+req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(blog);
}