import {BlogDbTypeMongo, BlogInputModel, BlogOutputType} from "../types/blog-db-type";
import {blogMapper} from "../mapper/mapper";
import {BlogsMongooseModel} from "../db/mongoose/models";
import mongoose from "mongoose";
import {injectable} from "inversify";

@injectable()
export class BlogCommandRepository {
    async create(blogData: BlogDbTypeMongo): Promise<{ error?: string, id?: mongoose.Types.ObjectId }> {
        try {
            const insertedBlog = await BlogsMongooseModel.create(blogData)
            //console.log(insertedInfo)
            return { id: insertedBlog._id };
        } catch (e) {
            return {error: 'Error'}
        }
    }
    async updateBlogById(id: mongoose.Types.ObjectId, updateData: Partial<BlogInputModel>): Promise<BlogOutputType | null> {
        try {
            const updatedBlog = await BlogsMongooseModel.findByIdAndUpdate(id, updateData, { new: true });
            if (updatedBlog) {
                return blogMapper(updatedBlog);
            } else {
                return null;
            }
        } catch (e) {
            throw new Error('Failed to update post');
        }
    }
    async deleteBlogById(id: mongoose.Types.ObjectId): Promise<boolean> {
        try {
            const result = await BlogsMongooseModel.deleteOne({ _id: id });
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error('Failed to delete post');
        }
    }
}
