import {ObjectId} from "mongodb";
import {postCollection} from "../db/mongo-db";
import {PostDbTypeMongo, PostInputModel, PostOutputType} from "../types/post-db-type";
import {postMapper} from "../mapper/mapper";
import {PostsMongooseModel} from "../db/mongoose/models";

export class PostCommandRepository {
    async create(postData: PostDbTypeMongo): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await PostsMongooseModel.create(postData)
            return { id: insertedInfo._id };
        } catch (error) {
            return {error: 'Error in postCommandRepository'}
        }
    }
    async updatePostById(id: ObjectId, updateData: Partial<PostInputModel>): Promise<PostOutputType | null> {
        try {
            const updatedPost = await PostsMongooseModel.findByIdAndUpdate(id, { $set: updateData }, { new: true })
            return updatedPost ? postMapper(updatedPost) : null;
        } catch (error) {
            console.error('Failed to update post:', error);
            throw new Error('Failed to update post');
        }
    }
    async deletePostById(id: ObjectId): Promise<boolean> {
        try {
            const result = await PostsMongooseModel.deleteOne({ _id: id });
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Failed to delete post:', error);
            throw new Error('Failed to delete post');
        }
    }
}