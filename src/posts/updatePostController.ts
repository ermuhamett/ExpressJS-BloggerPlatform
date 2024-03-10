import {Request, Response} from "express";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {PostOutputType} from "../db/post-db-type";
import {postRepository} from "./postRepository";

export const updatePostController = async (req: Request<{
    id: string
}>, res: Response<PostOutputType | OutputErrorsType>) => {
    const postId = +req.params.id;
    if (!postId) {
        res.sendStatus(400);
        return;
    }
    const updatedPost = await postRepository.updatePostById(postId, req.body);
    if (!updatedPost) {
        res.sendStatus(404);
        return;
    }
    return res.status(204).json(updatedPost);
}

