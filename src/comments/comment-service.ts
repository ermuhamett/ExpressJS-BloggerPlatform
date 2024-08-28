import {CommentCommandRepository} from "./commentCommandRepository";
import {ICommentDbMongo, ICommentInputModel} from "../types/comment-db-type";
import {ILikeDbModel, ILikeInputModel, LikeStatuses} from "../types/like-db-type";
import {CommentQueryRepository} from "./commentQueryRepository";
import {ResultStatus} from "../types/result.type";
import {errorMessagesHandleService} from "../common/adapters/errorMessageHandle.service";
import {inject, injectable} from "inversify";

@injectable()
export class CommentService {
    constructor(@inject(CommentCommandRepository) readonly commentCommandRepository: CommentCommandRepository) {
    }
    async createComment(content: string, commentatorInfo: { id: string; login: string }, postId: string) {
        const comment: ICommentDbMongo = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.id,
                userLogin: commentatorInfo.login
            },
            createdAt: new Date().toISOString(),
        }
        const newCommentId = await this.commentCommandRepository.create(comment)
        if (!newCommentId.id) {
            return null
        }
        return newCommentId.id
    }
    async updateCommentById(commentId: string, updateData: ICommentInputModel) {
        return this.commentCommandRepository.updateCommentById(commentId, updateData)
    }
    async deleteCommentById(commentId: string) {
        return this.commentCommandRepository.deleteCommentById(commentId)
    }
    async updateCommentLikeStatus(commentId:string,userId:string,payload:ILikeInputModel){
        const updateCommentLikeDto:ILikeDbModel={
            authorId:userId,
            parentId:commentId,
            status:payload.likeStatus
        }
        //console.log(updateCommentLikeDto.status)
        return await this.commentCommandRepository.updateLikeStatus(updateCommentLikeDto)
    }
}
