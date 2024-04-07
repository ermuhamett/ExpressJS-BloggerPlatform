import {Request, Response} from "express";
import {ICommentOutputModel} from "../../types/comment-db-type";
import {ObjectId} from "mongodb";
import {commentQueryMongoRepository} from "../commentQueryMongoRepository";
export const getCommentController = async(req: Request<{ id: string }>, res: Response<ICommentOutputModel>) => {
    if (ObjectId.isValid(req.params.id)) {
        const comment = await commentQueryMongoRepository.findForOutput(new ObjectId(req.params.id))
        if (!comment) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(comment);
    } else {
        res.sendStatus(400)
    }
}