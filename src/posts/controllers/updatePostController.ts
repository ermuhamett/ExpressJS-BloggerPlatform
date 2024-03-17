import {Request, Response} from "express";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {PostOutputType} from "../../db/post-db-type";
import {postMongoRepository} from "../postMongoRepository";
import {ObjectId} from "mongodb";

export const updatePostController = async (req: Request<{
    id: string
}>, res: Response<PostOutputType | OutputErrorsType>) => {
    const postId = req.params.id;
    if (!postId && ObjectId.isValid(postId)) {
        res.sendStatus(400);
        return;
    }
    //const objectId = new ObjectId(postId); // Преобразуем строку в ObjectId
    const updatedPost = await postMongoRepository.updatePostById(new ObjectId(postId), req.body);
    if (!updatedPost) {
        res.sendStatus(404);
        return;
    }
    return res.status(204).json(updatedPost);
}

