import {BlogDbTypeMongo, BlogInputModel} from "../types/blog-db-type";
import {BlogCommandRepository} from "./blogCommandRepository";
import mongoose from "mongoose";
export class BlogService {
    constructor(readonly blogCommandRepository:BlogCommandRepository) {}
    async createBlog(input: BlogInputModel):Promise<{ error?: string, id?: mongoose.Types.ObjectId }> {
        const blog:BlogDbTypeMongo = {
            name:input.name,
            description:input.description,
            websiteUrl:input.websiteUrl,
            createdAt:new Date().toISOString(),
            isMembership:false
        }
        const newBlog=await this.blogCommandRepository.create(blog)
        if (!newBlog) return {error:'Ошибка при созданий блога'};
        return newBlog
        //return await blogQueryRepository.findForOutput(new ObjectId(newBlog.id))
    }
    async updateBlogById(blogId:mongoose.Types.ObjectId, updatedData:BlogInputModel){
        return this.blogCommandRepository.updateBlogById(blogId,updatedData)
    }
    async deleteBlogById(blogId:mongoose.Types.ObjectId){
        return this.blogCommandRepository.deleteBlogById(blogId)
    }
}