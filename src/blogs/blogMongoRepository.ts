import {ObjectId} from "mongodb";
import {BlogDbType, BlogInputModel, BlogOutputType} from "../db/blog-db-type";
import {blogCollection} from "../db/mongo-db";
import {blogMapper} from "../mapper/mapper";

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
    },
    async find(id: ObjectId){
        return await blogCollection.findOne({_id:id})
    },
    async findForOutput(id: ObjectId): Promise<null | BlogOutputType> {
        try {
            const blog = await this.find(id);
            return blog ? blogMapper(blog) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
}