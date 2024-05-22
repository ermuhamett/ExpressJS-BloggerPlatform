import {Request, Response} from "express";
import {ICommentOutputModel} from "../types/comment-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {CommentQueryRepository} from "./commentQueryRepository";
import {CommentService} from "./comment-service";
export class CommentController {
    constructor(readonly commentService:CommentService,
                readonly commentQueryRepository: CommentQueryRepository) {}
    async deleteCommentById(req: Request<{
        commentId: string
    }>, res: Response<ICommentOutputModel | OutputErrorsType>) {
        const commentId = req.params.commentId;
        if (!commentId && ObjectId.isValid(commentId)) {
            res.sendStatus(400);
            return;
        }
        const isDeleted = await this.commentService.deleteCommentById(new ObjectId(req.params.commentId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
    async getCommentById(req: Request<{ id: string }>, res: Response<ICommentOutputModel>) {
        if (ObjectId.isValid(req.params.id)) {
            const comment = await this.commentQueryRepository.findForOutput(new ObjectId(req.params.id))
            if (!comment) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(comment);
        } else {
            res.sendStatus(400)
        }
    }
    async updateCommentById(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>){
        const commentId = req.params.commentId;
        if (!commentId && ObjectId.isValid(commentId)) {
            res.sendStatus(400);
            return;
        }
        const updatedComment = await this.commentService.updateCommentById(new ObjectId(req.params.commentId), req.body);
        if (!updatedComment) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedComment);
    }
}