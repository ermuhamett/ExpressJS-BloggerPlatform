import {Request, Response} from "express";
import {helper, QueryOutputType} from "../../middleware/helper";
import {postMongoQueryRepository} from "../postMongoQueryRepository";
export const getPostsController = async(req: Request, res: Response) => {
    const sanitizedQuery:QueryOutputType=helper(req.query)
    const posts=await postMongoQueryRepository.getMany(sanitizedQuery)
    if(!posts){
        res.sendStatus(404)
        return
    }
    res.status(200).json(posts)
}