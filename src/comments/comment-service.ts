import {CommentCommandRepository} from "./commentCommandRepository";
import {ObjectId} from "mongodb";
import {ICommentDbMongo, ICommentInputModel} from "../types/comment-db-type";
import mongoose from "mongoose";

export class CommentService {
    constructor(readonly commentCommandRepository:CommentCommandRepository) {}
    async createComment(content: string, commentatorInfo: { id: string; login: string },postId:string){
        const comment:ICommentDbMongo={
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.id,
                userLogin: commentatorInfo.login
            },
            createdAt: new Date().toISOString(),
            postId:postId
        }
        const newCommentId=await this.commentCommandRepository.create(comment)
        if (!newCommentId.id) {
            return null
        }
        return newCommentId
        //return await commentQueryRepository.findForOutput(new ObjectId(newCommentId.id))
    }
    async updateCommentById(commentId:mongoose.Types.ObjectId, updateData:ICommentInputModel){
        return this.commentCommandRepository.updateCommentById(commentId,updateData)
    }
    async deleteCommentById(commentId:mongoose.Types.ObjectId){
        return this.commentCommandRepository.deleteCommentById(commentId)
    }
}
/*export const commentService = {
    async updateCommentById(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>){
        const updatedComment = await commentCommandRepository.updateCommentById(new ObjectId(req.params.commentId), req.body);
        if (!updatedComment) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedComment);
    },
    async deleteCommentById(req: Request<{ commentId : string }>, res: Response<ICommentOutputModel | OutputErrorsType>) {
        const isDeleted = await commentCommandRepository.deleteCommentById(new ObjectId(req.params.commentId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}*/