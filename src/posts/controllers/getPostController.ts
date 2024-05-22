import {Request, Response} from "express";
import {PostOutputType} from "../../types/post-db-type";
import {ObjectId} from "mongodb";
import {postMongoQueryRepository} from "../postMongoQueryRepository";
export const getPostController = async(req: Request<{ id: string }>, res: Response<PostOutputType>) => {
    if (ObjectId.isValid(req.params.id)) {
        const post = await postMongoQueryRepository.findForOutput(new ObjectId(req.params.id))
        if (!post) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(post);
    } else {
        res.sendStatus(400)
    }
}