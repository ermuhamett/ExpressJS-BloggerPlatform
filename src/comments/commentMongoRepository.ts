import {ObjectId} from "mongodb";
import {commentMapper} from "../mapper/mapper";
import {ICommentDbMongo, ICommentInputModel, ICommentOutputModel} from "../types/comment-db-type";
import {commentCollection} from "../db/mongo-db";

export const commentMongoRepository = {
    async create(content: string, commentatorInfo: { id: ObjectId; login: string },postId:string): Promise<{
        error?: string,
        id?: ObjectId
    }> {
        const newComment: ICommentDbMongo = {
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.id.toString(),
                userLogin: commentatorInfo.login
            },
            createdAt: new Date().toISOString(),
            postId:postId
        }
        try {
            const insertedInfo = await commentCollection.insertOne(newComment)
            console.log(insertedInfo)
            return {id: insertedInfo.insertedId};
        } catch (e) {
            return {error: 'Error'}
        }
    },
    async updateCommentById(id: ObjectId, updateData: Partial<ICommentInputModel>): Promise<ICommentOutputModel | null> {
        try {
            const updatedComment = await commentCollection.findOneAndUpdate(
                {_id: id},
                {$set: updateData},
                {returnDocument: 'after'}
            );
            if (updatedComment) {
                return commentMapper(updatedComment);
            } else {
                return null;
            }
        } catch (e) {
            throw new Error('Failed to update post');
        }
    },
    async deleteCommentById(id: ObjectId): Promise<boolean> {
        try {
            const result = await commentCollection.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error('Failed to delete post');
        }
    },
    /*async find(id: ObjectId) {
        return await commentCollection.findOne({_id: id})
    },
    async findForOutput(id: ObjectId): Promise<null | ICommentOutputModel> {
        try {
            const comment = await this.find(id);
            return comment ? commentMapper(comment) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },*/
}