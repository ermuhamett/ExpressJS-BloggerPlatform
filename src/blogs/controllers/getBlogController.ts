import {Request, Response} from "express";
import {BlogOutputType} from "../../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogMongoRepository} from "../blogMongoRepository";
export const getBlogController = async(req: Request<{ id: string }>, res: Response<BlogOutputType>) => {
    if (ObjectId.isValid(req.params.id)) {
        const blog = await blogMongoRepository.findForOutput(new ObjectId(req.params.id))
        if (!blog) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(blog);
    } else {
        res.sendStatus(400)
    }
}