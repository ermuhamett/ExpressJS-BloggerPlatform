import {Request, Response} from "express";
import {BlogOutputType} from "../../db/blog-db-type";
import {blogMongoRepository} from "../blogMongoRepository";

export const getBlogsController = async (req: Request, res: Response<BlogOutputType[]>) => {
    const blogs = await blogMongoRepository.getAll()
    if(!blogs){
        res.sendStatus(404)
        return
    }
    res.status(200).json(blogs)
}