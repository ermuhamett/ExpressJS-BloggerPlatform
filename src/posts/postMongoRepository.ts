import {ObjectId, WithId} from "mongodb";
import {postCollection, PostDbTypeMongo} from "../db/mongo-db";
import {PostDbType, PostInputModel, PostOutputType} from "../db/post-db-type";
import {blogMongoRepository} from "../blogs/blogMongoRepository";

export const postMongoRepository = {
    async create(input: PostInputModel): Promise<{ error?: string, id?: ObjectId }> {
        const blog = await blogMongoRepository.find(new ObjectId(input.blogId))
        if (!blog) {
            return {error: 'Blog not found'};
        }
        const post:PostDbType = {
            title:input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId:input.blogId,
            blogName:blog.name,
            createdAt:new Date().toISOString()
        }
        try {
            const insertedInfo = await postCollection.insertOne(post)
            console.log(insertedInfo)
            return { id: insertedInfo.insertedId };
        } catch (e) {
            return {error: 'Error'}
        }
    },
    async getAll(): Promise<PostOutputType[] | null> {
        try {
            const posts = await postCollection.find().toArray();
            if(!posts.length){
                return null
            }
            return posts.map(this.mapToOutput);
        } catch (e) {
            throw new Error('Failed to fetch posts');
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
                return this.mapToOutput(updatedPost);
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
    async find(id: ObjectId){
        return await postCollection.findOne({_id:id})
    },
    async findForOutput(id: ObjectId): Promise<null | PostOutputType> {
        try {
            const post = await this.find(id);
            return post ? this.mapToOutput(post) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
    mapToOutput(post: WithId<PostDbTypeMongo>): PostOutputType {
        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt, // Добавляем createdAt
        };
    }
}