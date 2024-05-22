import {Request, Response} from "express";
import {PostService} from "../post-service";
import {postMongoQueryRepository} from "../postMongoQueryRepository";
import {ObjectId} from "mongodb";
export const createPostController = async(req: Request, res: Response) => {
    const createdPostId=await PostService.createPost(req.body)
    if (!createdPostId) {
        return res.status(500).json({})
    }
    const result=await postMongoQueryRepository.findForOutput(new ObjectId(createdPostId.id))
    return res.status(201).json(result)
}