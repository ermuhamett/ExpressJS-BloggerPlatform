import {ObjectId} from "mongodb";
import {ICommentDbMongo, ICommentInputModel} from "../types/comment-db-type";
import {CommentsMongooseModel, LikesMongooseModel} from "../db/mongoose/models";
import {ILikeDbModel} from "../types/like-db-type";
import {ResultStatus} from "../types/result.type";
import {injectable} from "inversify";

@injectable()
export class CommentCommandRepository {
    async create(commentData: ICommentDbMongo): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedComment = await CommentsMongooseModel.create(commentData)
            console.log(insertedComment)
            return {id: insertedComment._id};
        } catch (error) {
            console.error('Error creating comment:', error);
            return {error: 'Error creating comment'};
        }
    }
    async createLikeStatus(createLikeStatusDto: ILikeDbModel) {
        const createResult = await LikesMongooseModel.create(createLikeStatusDto)
        return createResult._id.toString()
    }
    async updateCommentById(id: string, updateData: Partial<ICommentInputModel>): Promise<Boolean | null> {
        try {
            const updatedComment = await CommentsMongooseModel.updateOne({_id:id}, updateData);
            return updatedComment.modifiedCount === 1;
        } catch (error) {
            console.error('Error updating comment:', error);
            throw new Error('Failed to update comment');
        }
    }
    async updateLikeStatus(updatedLikeStatusDto: ILikeDbModel) {
        try {
            const like = await LikesMongooseModel.findOneAndUpdate(
                {
                    $and: [
                        {authorId: updatedLikeStatusDto.authorId},
                        {parentId: updatedLikeStatusDto.parentId}
                    ]
                },
                {
                    $set: {
                        status: updatedLikeStatusDto.status
                    }
                },
                {
                    new: true, // Возвращает обновленный документ
                    upsert: true // Создает новый документ, если он не найден
                }
            );
            return {
                status: ResultStatus.Success,
                data: like
            }
        } catch (error) {
            // Обработка ошибок, например, логирование или возврат сообщения об ошибке
            console.error('Error updating comment like:', error);
            return {
                status: ResultStatus.Error,
                message: 'An error occurred while updating the like status.'
            };
        }
        //return Boolean(updateResult.matchedCount)
    }
    async deleteCommentById(id: string): Promise<boolean> {
        try {
            const result = await CommentsMongooseModel.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error('Failed to delete comment');
        }
    }
}