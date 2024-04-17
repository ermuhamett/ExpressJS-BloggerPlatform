import {Request, Response} from "express";
import {ICommentOutputModel} from "../../types/comment-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {commentMongoRepository} from "../commentMongoRepository";
import {ObjectId} from "mongodb";
export const updateCommentController = async (req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>) => {
    const commentId = req.params.commentId;
    if (!commentId && ObjectId.isValid(commentId)) {
        res.sendStatus(400);
        return;
    }
    const updatedComment = await commentMongoRepository.updateCommentById(new ObjectId(req.params.commentId), req.body);
    if (!updatedComment) {
        res.sendStatus(404);
        return;
    }
    return res.status(204).json(updatedComment);
}