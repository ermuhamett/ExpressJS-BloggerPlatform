import {Request,Response} from "express";
import {ICommentOutputModel} from "../../types/comment-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {commentMongoRepository} from "../commentMongoRepository";
import {ObjectId} from "mongodb";

export const deleteCommentController = async(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>) => {
    const commentId = req.params.commentId;
    if (!commentId && ObjectId.isValid(commentId)) {
        res.sendStatus(400);
        return;
    }
    const isDeleted = await commentMongoRepository.deleteCommentById(new ObjectId(req.params.commentId));
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204) //Success:No Content
}