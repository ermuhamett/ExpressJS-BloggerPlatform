import {ObjectId} from "mongodb";
import {postCollection} from "../db/mongo-db";
import {PostDbTypeMongo, PostInputModel, PostOutputType} from "../types/post-db-type";
import {blogMongoRepository} from "../blogs/blogMongoRepository";
import {postMapper} from "../mapper/mapper";
import {blogMongoQueryRepository} from "../blogs/blogMongoQueryRepository";

export const postMongoRepository = {
    async create(input: PostInputModel): Promise<{ error?: string, id?: ObjectId }> {
        const blog = await blogMongoQueryRepository.find(new ObjectId(input.blogId))
        if (!blog) {
            return {error: 'Blog not found'};
        }
        const post:PostDbTypeMongo = {
            title:input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId:input.blogId,
            blogName:blog.name,
            createdAt:new Date().toISOString()
        }
        try {
            const insertedInfo = await postCollection.insertOne(post)
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