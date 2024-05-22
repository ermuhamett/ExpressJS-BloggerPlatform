import {Request, Response} from "express";
import {blogMongoQueryRepository} from "../blogMongoQueryRepository";
import {ObjectId} from "mongodb";
import {PostService} from "../../posts/post-service";
import {postMongoQueryRepository} from "../../posts/postMongoQueryRepository";
export const createPostByBlog = async(req: Request, res: Response) => {
    const blogId = req.params.blogId;
    try {
        const blog = await blogMongoQueryRepository.find(new ObjectId(blogId))
        if (!blog) {
            return res.status(404).json({error: 'Not Found'})
        } else {
            const createdPostId = await PostService.createPost({...req.body, blogId})
            if(!createdPostId){
                return res.sendStatus(500)
            }
            const createdPost=await postMongoQueryRepository.findForOutput(new ObjectId(createdPostId.id))
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