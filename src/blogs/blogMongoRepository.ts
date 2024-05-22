import {ObjectId} from "mongodb";
import {BlogDbTypeMongo, BlogInputModel, BlogOutputType} from "../types/blog-db-type";
import {blogCollection} from "../db/mongo-db";
import {blogMapper} from "../mapper/mapper";

export const blogMongoRepository ={
    async create(blogData: BlogDbTypeMongo): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await blogCollection.insertOne(blogData)
            //console.log(insertedInfo)
            return { id: insertedInfo.insertedId };
        } catch (e) {
            return {error: 'Error'}
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
                return blogMapper(updatedBlog);
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
    }
}