import {Request, Response} from "express";
import {ICommentOutputModel} from "../types/comment-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {CommentQueryRepository} from "./commentQueryRepository";
import {CommentService} from "./comment-service";
import {ILikeInputModel} from "../types/like-db-type";
import {ResultStatus} from "../types/result.type";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";

@injectable()
export class CommentController {
    constructor(@inject(CommentService) readonly commentService:CommentService,
                @inject(CommentQueryRepository) readonly commentQueryRepository: CommentQueryRepository) {}
    async deleteCommentById(req: Request<{
        commentId: string
    }>, res: Response<ICommentOutputModel | OutputErrorsType>) {
        const commentId = req.params.commentId;
        if (!commentId && ObjectId.isValid(commentId)) {
            res.sendStatus(400);
            return;
        }
        const isDeleted = await this.commentService.deleteCommentById(req.params.commentId);
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
    async getCommentById(req: Request<{ id: string }>, res: Response<ICommentOutputModel>) {
        if (ObjectId.isValid(req.params.id)) {
            const comment = await this.commentQueryRepository.findForOutput(req.params.id, req.userId!)
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
        const updatedComment = await this.commentService.updateCommentById(req.params.commentId, req.body);
        if (!updatedComment) {
            res.sendStatus(404);
            return;
        }
        return res.sendStatus(204);
    }
    async updateCommentLikeStatus(req:Request<{commentId:string}, ILikeInputModel>, res:Response){
        const user=req.user!
        if(!user && mongoose.Types.ObjectId.isValid(req.params.commentId)){
            return res.sendStatus(404)
        }
        const likeUpdateResult=await this.commentService.updateCommentLikeStatus(req.params.commentId, user.id, {likeStatus:req.body.likeStatus})
        if(likeUpdateResult.status===ResultStatus.Success){
            return res.sendStatus(204)
        } else{
            console.log(likeUpdateResult.status, likeUpdateResult.message);
            return res.sendStatus(404)
        }
    }
}