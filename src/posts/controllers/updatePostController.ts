import {Request, Response} from "express";
import {PostOutputType} from "../../types/post-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";
import {postMongoRepository} from "../postMongoRepository";
export const updatePostController = async(req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>) => {
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
}