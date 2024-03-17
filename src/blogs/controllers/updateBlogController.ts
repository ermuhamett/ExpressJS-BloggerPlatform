import {Request, Response} from "express";
import {BlogOutputType} from "../../db/blog-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {blogMongoRepository} from "../blogMongoRepository";

export const updateBlogController = async (req:Request<{id:string}>,res:Response<BlogOutputType | OutputErrorsType>) => {
    const blogId = req.params.id;
    if (!blogId && ObjectId.isValid(blogId)) {
        res.sendStatus(400);
        return;
    }
    const updatedBlog = await blogMongoRepository.updateBlogById(new ObjectId(blogId), req.body);
    if (!updatedBlog) {
        res.sendStatus(404);
        return;
    }
    return res.status(204).json(updatedBlog);
}