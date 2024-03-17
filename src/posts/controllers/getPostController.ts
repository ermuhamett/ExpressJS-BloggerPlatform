import {Request, Response} from "express";
import {PostDbType, PostOutputType} from "../../db/post-db-type";
import {postMongoRepository} from "../postMongoRepository";
import {ObjectId} from "mongodb";

export const getPostController = async (req: Request<{ id: string }>, res: Response<PostOutputType>) => {
    if (ObjectId.isValid(req.params.id)) {
        const post = await postMongoRepository.findForOutput(new ObjectId(req.params.id))
        if (!post) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(post);
    } else {
        res.sendStatus(400)
    }
}