import {Request, Response} from "express";
import {postMongoRepository} from "./postMongoRepository";
import {PostOutputType} from "../db/post-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
export const postService = {
    async createPost(req: Request, res: Response) {
        const createdId = await postMongoRepository.create(req.body)
        if (!createdId.id) {
            res.status(500).json({})
            return
        }
        const newPost = await postMongoRepository.findForOutput(createdId.id)
        return res.status(201).json(newPost)
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