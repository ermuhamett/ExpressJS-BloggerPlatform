import {Request, Response} from "express";
import {postMongoRepository} from "./postMongoRepository";
import {PostOutputType} from "../types/post-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {commentMongoRepository} from "../comments/commentMongoRepository";
import {commentQueryMongoRepository} from "../comments/commentQueryMongoRepository";
import {postMongoQueryRepository} from "./postMongoQueryRepository";

export const postService = {
    async createPost(req: Request, res: Response) {
        const createdId = await postMongoRepository.create(req.body)
        if (!createdId.id) {
            return res.status(500).json({})
        }
        const newPost = await postMongoQueryRepository.findForOutput(createdId.id)
        return res.status(201).json(newPost)
    },
    async createComment(req: Request, res: Response) {
        const {content}= req.body;
        const {id, login} = req.user!
        const { postId } = req.params; // Получаем postId из параметров маршрута
        try {
            // Проверяем существование поста с указанным postId
            if(!ObjectId.isValid(postId)){
                return res.status(400).json({ error: "Invalid postId" });
            }
            const post = await postMongoQueryRepository.find(new ObjectId(postId));
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }
            const createdId = await commentMongoRepository.create(content,  { id, login }, postId);
            if (!createdId.id) {
                res.status(500).json({})
                return
            }
            const newComment=await commentQueryMongoRepository.findForOutput(createdId.id)
            return res.status(201).json(newComment)
        } catch (error) {
            return res.status(500).json({error: "Failed to create comment"});
        }
    },
    async updatePost(req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>) {
        const postId = req.params.id;
        if (!postId && ObjectId.isValid(postId)) {
            res.sendStatus(400);
            return;
        }
        const updatedPost = await postMongoRepository.updatePostById(new ObjectId(postId), req.body);
        if (!updatedPost) {
            res.sendStatus(404);
            return;
        }
        return res.status(204).json(updatedPost);
    },
    async deletePost(req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>,) {
        const postId = req.params.id
        if (!postId && ObjectId.isValid(postId)) {
            res.sendStatus(400)
            return;
        }
        const isDeleted = await postMongoRepository.deletePostById(new ObjectId(postId));
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}