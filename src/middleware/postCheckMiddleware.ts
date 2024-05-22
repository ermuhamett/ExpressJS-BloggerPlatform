//import "reflect-metadata"
import {NextFunction, Request, Response} from "express";
import {container} from "../main/composition-root";
import {PostQueryRepository} from "../posts/postQueryRepository";

const postQueryRepository=container.resolve<PostQueryRepository>(PostQueryRepository)

export const checkPostExistence = async(req: Request, res: Response, next: NextFunction) => {
    const postId=req.params.postId
    const post=await postQueryRepository.find(postId)
    if(!post){
        res.sendStatus(404);
        return
    }
    next();
}