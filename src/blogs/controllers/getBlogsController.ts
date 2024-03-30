import {Request, Response} from "express";
import {helper, QueryOutputType} from "../../middleware/helper";
import {blogMongoQueryRepository} from "../blogMongoQueryRepository";

export const getBlogsController = async(req: Request, res: Response) => {
    const sanitizedQuery: QueryOutputType = helper(req.query)
    const blogs = await blogMongoQueryRepository.getMany(sanitizedQuery)
    if (!blogs) {
        res.sendStatus(404)
        return
    }
    return res.status(200).json(blogs)
}