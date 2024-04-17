import {blogMongoRepository} from "./blogMongoRepository";
import {BlogDbTypeMongo, BlogInputModel} from "../types/blog-db-type";
import {ObjectId} from "mongodb";
import {blogMongoQueryRepository} from "./blogMongoQueryRepository";
import {PostInputModel} from "../types/post-db-type";

export class BlogService {
    static async createBlog(input: BlogInputModel):Promise<{ error?: string, id?: ObjectId }> {
        const blog:BlogDbTypeMongo = {
            name:input.name,
            description:input.description,
            websiteUrl:input.websiteUrl,
            createdAt:new Date().toISOString(),
            isMembership:false
        }
        const newBlog=await blogMongoRepository.create(blog)
        if (!newBlog) return {error:'Ошибка при созданий блога'};
        return newBlog
        //return await blogMongoQueryRepository.findForOutput(new ObjectId(newBlog.id))
    }
}