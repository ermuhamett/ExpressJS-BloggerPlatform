import {Request, Response} from "express";
import {helper, QueryOutputType} from "../../middleware/helper";
import {commentQueryMongoRepository} from "../../comments/commentQueryMongoRepository";
import {postMongoQueryRepository} from "../postMongoQueryRepository";
import {ObjectId} from "mongodb";
export const getCommentsForPost = async(req: Request<{ postId: string }>, res: Response) => {
    //TODO надо проверить существует ли такой post типо если нету поста смысла создовать коммента
    const post=await postMongoQueryRepository.find(new ObjectId(req.params.postId))
    if(!post){
        res.sendStatus(404)
        return
    }
    const sanitizedQuery:QueryOutputType=helper(req.query)
    const comments=await commentQueryMongoRepository.getMany(sanitizedQuery, req.params.postId)
    if(!comments){
        res.sendStatus(404)
        return
    }
    res.status(200).json(comments)
}