import {Request, Response} from "express";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ICommentOutputModel} from "../types/comment-db-type";
import {ObjectId} from "mongodb";
import {commentMongoRepository} from "./commentMongoRepository";
import {commentQueryMongoRepository} from "./commentQueryMongoRepository";

export class CommentService {
    
}
/*export const commentService = {
    async updateCommentById(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>){
        const updatedComment = await commentMongoRepository.updateCommentById(new ObjectId(req.params.commentId), req.body);
        if (!updatedComment) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedComment);
    },
    async deleteCommentById(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>) {
        const isDeleted = await commentMongoRepository.deleteCommentById(new ObjectId(req.params.commentId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}*/