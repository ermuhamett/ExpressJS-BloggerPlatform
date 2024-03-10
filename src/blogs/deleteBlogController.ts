import {Request, Response} from "express";
import {BlogOutputType} from "../db/blog-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {postRepository} from "../posts/postRepository";
import {blogRepository} from "./blogRepository";

export const deleteBlogController = async (req: Request<{id: string }>, res: Response<BlogOutputType | OutputErrorsType>) => {
    const blogId=+req.params.id
    if(!blogId){
        res.sendStatus(400)
        return;
    }
    const isDeleted = await blogRepository.deleteBlogById(blogId);
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204) //Success:No Content
}