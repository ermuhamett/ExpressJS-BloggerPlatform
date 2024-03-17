import {Request, Response} from "express";
import {BlogOutputType} from "../../db/blog-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {blogMongoRepository} from "../blogMongoRepository";

export const deleteBlogController = async (req: Request<{id: string }>, res: Response<BlogOutputType | OutputErrorsType>) => {
    const blogId=req.params.id
    if(!blogId && ObjectId.isValid(blogId)){
        res.sendStatus(400)
        return;
    }
    const isDeleted = await blogMongoRepository.deleteBlogById(new ObjectId(blogId));
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204) //Success:No Content
}