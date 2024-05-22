import {CommentCommandRepository} from "./commentCommandRepository";
import {ICommentDbMongo, ICommentInputModel} from "../types/comment-db-type";
import {ILikeDbModel, ILikeInputModel, LikeStatuses} from "../types/like-db-type";
import {CommentQueryRepository} from "./commentQueryRepository";
import {ResultStatus} from "../types/result.type";
import {errorMessagesHandleService} from "../common/adapters/errorMessageHandle.service";

export class CommentService {
    constructor(readonly commentCommandRepository: CommentCommandRepository,
                readonly commentQueryRepository: CommentQueryRepository) {
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

    /*async updateCommentLikeStatus(commentId: string, userId: string, payload: ILikeInputModel) {
        const comment = await this.commentQueryRepository.find(commentId)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: errorMessagesHandleService({message: 'Comment by id not found', field: 'comment'})
            }
        }
        const currentLikeStatus = await this.commentQueryRepository.getLikeStatus(userId, commentId)
        let likesCountChange = 0
        let dislikesCountChange = 0
        if (currentLikeStatus) {
            const updatedLikeStatusDto: ILikeDbModel = {
                authorId: currentLikeStatus.authorId,
                parentId: currentLikeStatus.parentId,
                status: payload.likeStatus,
                createdAt: currentLikeStatus.createdAt,
            }
            await this.commentCommandRepository.updateLikeStatus(updatedLikeStatusDto)
            const {dislikesCount, likesCount} = this.calculateChanges(currentLikeStatus.status, payload.likeStatus)
            likesCountChange = likesCount
            dislikesCountChange = dislikesCount
        } else {
            const createLikeStatusDto: ILikeDbModel = {
                authorId: userId,
                parentId: commentId,
                status: payload.likeStatus,
                createdAt: new Date(),
            }
            await this.commentCommandRepository.createLikeStatus(createLikeStatusDto)
            likesCountChange = payload.likeStatus === LikeStatuses.LIKE ? 1 : 0
            dislikesCountChange = payload.likeStatus === LikeStatuses.DISLIKE ? 1 : 0
        }
        const likesCount = comment.likesCount + likesCountChange
        const dislikesCount = comment.dislikesCount + dislikesCountChange
        const updatedComment: ICommentDbMongo = {
            postId: comment.postId,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesCount: likesCount,
            dislikesCount: dislikesCount,
        }
        const updateResult = await this.commentCommandRepository.updateCommentById(commentId, updatedComment)
        if (!updateResult) {
            return {
                status: ResultStatus.NotFound,
                data: errorMessagesHandleService({
                    message: 'Cant update comment after likes/dislikes',
                    field: 'comment'
                })
            }
        }
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    calculateChanges(currentStatus: LikeStatuses, changedStatus: LikeStatuses) {
        let likesCount = 0
        let dislikesCount = 0

        switch (currentStatus) {
            case LikeStatuses.LIKE:
                likesCount = changedStatus === LikeStatuses.DISLIKE ? -1 : 0;
                dislikesCount = changedStatus === LikeStatuses.DISLIKE ? 1 : 0;
                break;
            case LikeStatuses.DISLIKE:
                likesCount = changedStatus === LikeStatuses.LIKE ? 1 : 0;
                dislikesCount = changedStatus === LikeStatuses.NONE ? -1 : 0;
                break;
            case LikeStatuses.NONE:
                likesCount = changedStatus === LikeStatuses.LIKE ? 1 : 0;
                dislikesCount = changedStatus === LikeStatuses.DISLIKE ? -1 : 0;
                break;
        }

        return {likesCount, dislikesCount}
    }*/
}
