import {PostService} from "./post-service";
import {Request, Response} from "express";
import {PostQueryRepository} from "./postQueryRepository";
import {ObjectId} from "mongodb";
import {PostOutputType} from "../types/post-db-type";
import {CommentQueryRepository} from "../comments/commentQueryRepository";
import {helper, QueryOutputType} from "../middleware/helper";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {CommentService} from "../comments/comment-service";
import {inject, injectable} from "inversify";
import {ILikeInputModel} from "../types/like-db-type";
import mongoose from "mongoose";
import {ResultStatus} from "../types/result.type";

@injectable()
export class PostController {
    constructor(@inject(PostService) readonly postService:PostService,
                @inject(CommentService) readonly commentService:CommentService,
                @inject(PostQueryRepository) readonly postQueryRepository:PostQueryRepository,
                @inject(CommentQueryRepository) readonly commentQueryRepository:CommentQueryRepository) {}
    async createPost(req: Request, res: Response){
        const createdPostId=await this.postService.createPost(req.body)
        if (!createdPostId) {
            return res.status(500).json({})
        }
        const result=await this.postQueryRepository.findForOutput(createdPostId.toString())
        return res.status(201).json(result)
    }
    async getPostById(req: Request<{ id: string }>, res: Response<PostOutputType>){
        if (ObjectId.isValid(req.params.id)) {
            const post = await this.postQueryRepository.findForOutput(req.params.id, req.userId!)
            if (!post) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(post);
        } else {
            res.sendStatus(400)
        }
    }
    async createCommentByPost(req: Request<{postId:string}>, res: Response){
        const {content}= req.body;
        const {id, login} = req.user!
        const { postId } = req.params; // Получаем postId из параметров маршрута
        // Проверяем существование поста с указанным postId
        if(!ObjectId.isValid(postId)){
            return res.status(400).json({ error: "Invalid postId" });
        }
        const post = await this.postQueryRepository.find(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        const createdCommentId=await this.commentService.createComment(content,{id, login},postId)
        if(!createdCommentId){
            return res.sendStatus(500)
        }
        const createdComment=await this.commentQueryRepository.findForOutput(createdCommentId.toString(), id)
        if(createdComment){
            return res.status(201).json(createdComment)
        } else{
            res.status(500).json({error:"Internal Server Error inside Controller"})
            return
        }
    }
    async getCommentsByPost(req: Request<{ postId: string }>, res: Response){
        //Надо проверить существует ли такой post типо если нету поста смысла создовать коммента
        const post=await this.postQueryRepository.find(req.params.postId)
        if(!post){
            res.sendStatus(404)
            return
        }
        const sanitizedQuery:QueryOutputType=helper(req.query)
        const comments=await this.commentQueryRepository.getMany(sanitizedQuery, req.params.postId, req.userId!)
        if(!comments){
            res.sendStatus(404)
            return
        }
        res.status(200).json(comments)
    }
    async getPostsController(req: Request, res: Response){
        const sanitizedQuery:QueryOutputType=helper(req.query)
        const posts=await this.postQueryRepository.getMany(sanitizedQuery,'',req.userId!)
        if(!posts){
            res.sendStatus(404)
            return
        }
        res.status(200).json(posts)
    }
    async updatePost(req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>){
        const postId = req.params.id;
        if (!postId && ObjectId.isValid(postId)) {
            res.sendStatus(400);
            return;
        }
        const updatedPost = await this.postService.updatePostById(new ObjectId(postId), req.body);
        if (!updatedPost) {
            res.sendStatus(404);
            return;
        }
        return res.sendStatus(204);
    }
    async updatePostLikeStatus(req:Request<{postId:string}, ILikeInputModel>, res:Response){
        const postId=req.params.postId;
        const user=req.user!
        /*if (!postId && mongoose.Types.ObjectId.isValid(postId)) {
            res.sendStatus(404);
            return;
        }*/
        const likeUpdateResult=await this.postService.createLikePost(postId,{likeStatus:req.body.likeStatus},user.id, user.login)
        if(likeUpdateResult.status===ResultStatus.Success){
            return res.sendStatus(204)
        }else{
            return res.sendStatus(502)
        }
        //res.sendStatus(204)
    }
    async deletePost(req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>){
        const postId = req.params.id
        if (!postId && ObjectId.isValid(postId)) {
            res.sendStatus(400)
            return;
        }
        const isDeleted = await this.postService.deletePostById(new ObjectId(postId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}