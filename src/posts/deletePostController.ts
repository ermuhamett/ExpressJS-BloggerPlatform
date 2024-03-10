import {Request, Response} from "express";
import {PostOutputType} from "../db/post-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {postRepository} from "./postRepository";

export const deletePostController = async (req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>,) => {
    const postId=+req.params.id
    if(!postId){
        res.sendStatus(400)
        return;
    }
    const isDeleted = await postRepository.deletePostById(postId);
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204) //Success:No Content
}