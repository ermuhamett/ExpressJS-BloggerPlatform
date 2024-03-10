import {Request,Response} from "express";
import {postRepository} from "./postRepository";
import {PostDbType, PostOutputType} from "../db/post-db-type";

export const getPostController = async (req:Request<{ id: string }>, res:Response<PostOutputType >) => {
    const post=await postRepository.findForOutput(+req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(post);
}