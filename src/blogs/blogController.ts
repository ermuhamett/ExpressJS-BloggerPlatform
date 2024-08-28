import {Request, Response} from "express";
import {BlogService} from "./blog-service";
import {ObjectId} from "mongodb";
import {BlogQueryRepository} from "./blogQueryRepository";
import {helper, QueryOutputType} from "../middleware/helper";
import {PostQueryRepository} from "../posts/postQueryRepository";
import {BlogOutputType} from "../types/blog-db-type";
import {PostService} from "../posts/post-service";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {inject, injectable} from "inversify";

@injectable()
export class BlogController {
    constructor(@inject(BlogService) readonly blogService:BlogService,
                @inject(BlogQueryRepository) readonly blogQueryRepository:BlogQueryRepository,
                @inject(PostQueryRepository) readonly postQueryRepository:PostQueryRepository,
                @inject(PostService) readonly postService:PostService) {}
    async createBlog(req:Request,res:Response){
        const createdBlogId=await this.blogService.createBlog(req.body)
        if(!createdBlogId){
            return res.sendStatus(500)
        }
        const createdBlog=await this.blogQueryRepository.findForOutput(new ObjectId(createdBlogId.id))
        if (!createdBlog) {
            return res.status(500).json({})
        }
        return res.status(201).json(createdBlog)
    }
    async getPostsByBlog(req: Request, res: Response){
        const blogId = req.params.blogId;
        const blog = await this.blogQueryRepository.find(new ObjectId(blogId))
        if (!blog) {
            return res.status(404).send('Blog not exist')
        } else {
            const sanitizedQuery: QueryOutputType = helper(req.query)
            const answer = await this.postQueryRepository.getMany(sanitizedQuery, blogId, req.userId!);
            if (!answer) {
                return res.sendStatus(500)
            }
            return res.status(200).send(answer)
        }
    }
    async getBlogById(req: Request<{ id: string }>, res: Response<BlogOutputType>){
        if (ObjectId.isValid(req.params.id)) {
            const blog = await this.blogQueryRepository.findForOutput(new ObjectId(req.params.id))
            if (!blog) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(blog);
        } else {
            res.sendStatus(400)
        }
    }
    async getBlogs(req: Request, res: Response){
        const sanitizedQuery: QueryOutputType = helper(req.query)
        const blogs = await this.blogQueryRepository.getMany(sanitizedQuery)
        if (!blogs) {
            res.sendStatus(404)
            return
        }
        return res.status(200).json(blogs)
    }
    async createPostByBlog(req: Request, res: Response){
        const blogId = req.params.blogId;
        try {
            const blog = await this.blogQueryRepository.find(new ObjectId(blogId))
            if (!blog) {
                return res.status(404).json({error: 'Not Found'})
            } else {
                const createdPostId = await this.postService.createPost({...req.body, blogId})
                if(!createdPostId){
                    return res.sendStatus(500)
                }
                const createdPost=await this.postQueryRepository.findForOutput(createdPostId.toString())
                if (!createdPost) {
                    return res.status(500).json({error: 'error be here'})
                }
                return res.status(201).json(createdPost)
            }
        } catch (error) {
            console.error("Error occurred:", error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    }
    async updateBlog(req: Request<{ id: string }>, res: Response<BlogOutputType | OutputErrorsType>){
        const blogId = req.params.id;
        if (!blogId && ObjectId.isValid(blogId)) {
            res.sendStatus(400);
            return;
        }
        const updatedBlog = await this.blogService.updateBlogById(new ObjectId(blogId), req.body);
        if (!updatedBlog) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedBlog);
    }
    async deleteBlog(req: Request<{ id: string }>, res: Response<BlogOutputType | OutputErrorsType>){
        const blogId = req.params.id
        if (!blogId && ObjectId.isValid(blogId)) {
            res.sendStatus(400)
            return;
        }
        const isDeleted = await this.blogService.deleteBlogById(new ObjectId(blogId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}