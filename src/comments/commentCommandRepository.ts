import {ObjectId} from "mongodb";
import {commentMapper} from "../mapper/mapper";
import {ICommentDbMongo, ICommentInputModel, ICommentOutputModel} from "../types/comment-db-type";
import {CommentsMongooseModel} from "../db/mongoose/models";
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
    async updateCommentById(id: ObjectId, updateData: Partial<ICommentInputModel>): Promise<ICommentOutputModel | null> {
        try {
            const updatedComment = await CommentsMongooseModel.findByIdAndUpdate(id, updateData, {new: true});
            if (updatedComment) {
                return commentMapper(updatedComment);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            throw new Error('Failed to update comment');
        }
    }
    async deleteCommentById(id: ObjectId): Promise<boolean> {
        try {
            const result = await CommentsMongooseModel.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw new Error('Failed to delete comment');
        }
    }
}