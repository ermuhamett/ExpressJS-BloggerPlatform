import {ObjectId} from "mongodb";
import {postCollection} from "../db/mongo-db";
import {PostDbTypeMongo, PostInputModel, PostOutputType} from "../types/post-db-type";
import {postMapper} from "../mapper/mapper";

export const postMongoRepository = {
    async create(postData: PostDbTypeMongo): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await postCollection.insertOne(postData)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId };
        } catch (e) {
            return {error: 'Error'}
        }
    },
    async updatePostById(id: ObjectId, updateData: Partial<PostInputModel>): Promise<PostOutputType | null> {
        try {
            const updatedPost = await postCollection.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            if (updatedPost) {
                return postMapper(updatedPost);
            } else {
                return null;
            }
        } catch (e) {
            throw new Error('Failed to update post');
        }
    },
    async deletePostById(id: ObjectId): Promise<boolean> {
        try {
            const result = await postCollection.deleteOne({ _id: id });
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error('Failed to delete post');
        }
    },
}