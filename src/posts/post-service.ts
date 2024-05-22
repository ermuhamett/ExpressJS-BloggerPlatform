import {postMongoRepository} from "./postMongoRepository";
import {PostDbTypeMongo, PostInputModel} from "../types/post-db-type";
import {ObjectId} from "mongodb";
import {commentMongoRepository} from "../comments/commentMongoRepository";
import {blogMongoQueryRepository} from "../blogs/blogMongoQueryRepository";
import {ICommentDbMongo} from "../types/comment-db-type";
export class PostService {
    static async createPost(input:PostInputModel){
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
        const newPost=await postMongoRepository.create(post)
        if (!newPost) return null;
        return newPost
    }
    static async createComment(content: string, commentatorInfo: { id: ObjectId; login: string },postId:string){
        const comment:ICommentDbMongo={
            content: content,
            commentatorInfo: {
                userId: commentatorInfo.id.toString(),
                userLogin: commentatorInfo.login
            },
            createdAt: new Date().toISOString(),
            postId:postId
        }
        const newCommentId=await commentMongoRepository.create(comment)
        if (!newCommentId.id) {
            return null
        }
        return newCommentId
       //return await commentQueryMongoRepository.findForOutput(new ObjectId(newCommentId.id))
    }
}