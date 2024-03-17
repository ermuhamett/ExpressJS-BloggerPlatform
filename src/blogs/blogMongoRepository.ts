import {ObjectId, WithId} from "mongodb";
import {BlogDbType, BlogInputModel, BlogOutputType} from "../db/blog-db-type";
import {blogCollection, BlogDbTypeMongo, postCollection} from "../db/mongo-db";


export const blogMongoRepository ={
    async create(input: BlogInputModel): Promise<{ error?: string, id?: ObjectId }> {
        const blog:BlogDbType = {
            name:input.name,
            description:input.description,
            websiteUrl:input.websiteUrl,
            createdAt:new Date().toISOString(),
            isMembership:false
        }
        try {
            const insertedInfo = await blogCollection.insertOne(blog)
            console.log(insertedInfo)
            return { id: insertedInfo.insertedId };
        } catch (e) {
            return {error: 'Error'}
        }
    },
    async getAll(): Promise<BlogOutputType[] | null> {
        try {
            const posts = await blogCollection.find().toArray();
            if(!posts.length){
                return null
            }
            return posts.map(this.mapToOutput);
        } catch (e) {
            throw new Error('Failed to fetch posts');
        }
    },
    async updateBlogById(id: ObjectId, updateData: Partial<BlogInputModel>): Promise<BlogOutputType | null> {
        try {
            const updatedBlog = await blogCollection.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            if (updatedBlog) {
                return this.mapToOutput(updatedBlog);
            } else {
                return null;
            }
        } catch (e) {
            throw new Error('Failed to update post');
        }
    },
    async deleteBlogById(id: ObjectId): Promise<boolean> {
        try {
            const result = await blogCollection.deleteOne({ _id: id });
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error('Failed to delete post');
        }
    },
    async find(id: ObjectId){
        return await blogCollection.findOne({_id:id})
    },
    async findForOutput(id: ObjectId): Promise<null | BlogOutputType> {
        try {
            const blog = await this.find(id);
            return blog ? this.mapToOutput(blog) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
    mapToOutput(blog: WithId<BlogDbTypeMongo>): BlogOutputType {
        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt, // Добавляем createdAt
            isMembership:blog.isMembership
        };
    }
}