import {Request, Response} from "express";
import {BlogOutputType} from "../db/blog-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {blogRepository} from "./blogRepository";

export const updateBlogController = async (req:Request<{id:string}>,res:Response<BlogOutputType | OutputErrorsType>) => {
    const blogId = +req.params.id;
    if (!blogId) {
        res.sendStatus(400);
        return;
    }
    const updatedBlog = await blogRepository.updateBlogById(blogId, req.body);
    if (!updatedBlog) {
        res.sendStatus(404);
        return;
    }
    return res.status(204).json(updatedBlog);
}