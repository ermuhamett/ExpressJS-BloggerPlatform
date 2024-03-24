import {Request, Response} from "express";
import {blogMongoRepository} from "./blogMongoRepository";
import {BlogOutputType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {helper, QueryOutputType} from "../middleware/helper";
import {postMongoQueryRepository} from "../posts/postMongoQueryRepository";
import {blogMongoQueryRepository} from "./blogMongoQueryRepository";
import {blogCollection} from "../db/mongo-db";
import {postMongoRepository} from "../posts/postMongoRepository";
import {postService} from "../posts/post-service";

export const blogService = {
    async createBlog(req: Request, res: Response) {
        const createId = await blogMongoRepository.create(req.body);
        if (!createId.id) {
            res.status(500).json({})
            return
        }
        const newBlog = await blogMongoRepository.findForOutput(createId.id)
        res.status(201).json(newBlog)
    },
    async createPost(req: Request, res: Response) {
        const blogId = req.params.blogId;
        try{
            const blog= await blogMongoRepository.find(new ObjectId(blogId))
            if(!blog){
                return res.status(404).json({error:'Not Found'})
            } else{
                const createdId = await postMongoRepository.create({...req.body, blogId})
                if (!createdId.id) {
                    return res.status(500).json({error:'error be here'})
                }
                const newPost = await postMongoRepository.findForOutput(createdId.id)
                return res.status(201).json(newPost)
            }
        }
        catch (error) {
            console.error("Error occurred:", error);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    },
    async getBlog(req: Request<{ id: string }>, res: Response<BlogOutputType>) {
        if (ObjectId.isValid(req.params.id)) {
            const blog = await blogMongoRepository.findForOutput(new ObjectId(req.params.id))
            if (!blog) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(blog);
        } else {
            res.sendStatus(400)
        }
    },
    async getBlogs(req: Request, res: Response) {
        const sanitizedQuery: QueryOutputType = helper(req.query)
        const blogs = await blogMongoQueryRepository.getMany(sanitizedQuery)
        if (!blogs) {
            res.sendStatus(404)
            return
        }
        return res.status(200).json(blogs)
    },
    async getPostByBlog(req: Request, res: Response) {
        const blogId = req.params.blogId;
        const blog= await blogMongoRepository.find(new ObjectId(blogId))
        if (!blog) {
            return res.status(404).send('Blog not exist')
        } else{
            const sanitizedQuery: QueryOutputType = helper(req.query)
            const answer = await postMongoQueryRepository.getMany(sanitizedQuery, blogId);
            if (!answer) {
                return res.sendStatus(500)
            }
            return res.status(200).send(answer)
        }
    },
    async updateBlogById(req: Request<{ id: string }>, res: Response<BlogOutputType | OutputErrorsType>) {
        const blogId = req.params.id;
        if (!blogId && ObjectId.isValid(blogId)) {
            res.sendStatus(400);
            return;
        }
        const updatedBlog = await blogMongoRepository.updateBlogById(new ObjectId(blogId), req.body);
        if (!updatedBlog) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedBlog);
    },
    async deleteBlogById(req: Request<{ id: string }>, res: Response<BlogOutputType | OutputErrorsType>) {
        const blogId = req.params.id
        if (!blogId && ObjectId.isValid(blogId)) {
            res.sendStatus(400)
            return;
        }
        const isDeleted = await blogMongoRepository.deleteBlogById(new ObjectId(blogId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}