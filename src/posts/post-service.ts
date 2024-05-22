import {PostCommandRepository} from "./postCommandRepository";
import {PostDbTypeMongo, PostInputModel} from "../types/post-db-type";
import {ObjectId} from "mongodb";
import {CommentCommandRepository} from "../comments/commentCommandRepository";
import {BlogQueryRepository} from "../blogs/blogQueryRepository";
import {ICommentDbMongo} from "../types/comment-db-type";
export class PostService {
    constructor(readonly blogQueryRepository:BlogQueryRepository,
                readonly postCommandRepository:PostCommandRepository) {}
    async createPost(input:PostInputModel){
        const blog = await this.blogQueryRepository.find(new ObjectId(input.blogId))
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
        const newPost=await this.postCommandRepository.create(post)
        if (!newPost) return null;
        return newPost
    }
    async updatePostById(postId:ObjectId,updateData:PostInputModel){
        return this.postCommandRepository.updatePostById(postId,updateData)
    }
    async deletePostById(postId:ObjectId){
        return this.postCommandRepository.deletePostById(postId)
    }
}
