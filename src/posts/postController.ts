import {PostService} from "./post-service";
import {Request, Response} from "express";
import {PostQueryRepository} from "./postQueryRepository";
import {ObjectId} from "mongodb";
import {PostOutputType} from "../types/post-db-type";
import {CommentQueryRepository} from "../comments/commentQueryRepository";
import {helper, QueryOutputType} from "../middleware/helper";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {CommentService} from "../comments/comment-service";

export class PostController {
    constructor(readonly postService:PostService,
                readonly commentService:CommentService,
                readonly postQueryRepository:PostQueryRepository,
                readonly commentQueryRepository:CommentQueryRepository) {}
    async createPost(req: Request, res: Response){
        const createdPostId=await this.postService.createPost(req.body)
        if (!createdPostId) {
            return res.status(500).json({})
        }
        const result=await this.postQueryRepository.findForOutput(new ObjectId(createdPostId.id))
        return res.status(201).json(result)
    }
    async getPostById(req: Request<{ id: string }>, res: Response<PostOutputType>){
        if (ObjectId.isValid(req.params.id)) {
            const post = await this.postQueryRepository.findForOutput(new ObjectId(req.params.id))
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
        const post = await this.postQueryRepository.find(new ObjectId(postId));
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
    ///TODO Fall back
    async getCommentsByPost(req: Request<{ postId: string }>, res: Response){
        //Надо проверить существует ли такой post типо если нету поста смысла создовать коммента
        const post=await this.postQueryRepository.find(new ObjectId(req.params.postId))
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
        const posts=await this.postQueryRepository.getMany(sanitizedQuery)
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
        return res.status(204).json(updatedPost);
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