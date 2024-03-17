import {Request, Response} from "express";
import {PostOutputType} from "../../db/post-db-type";
import {OutputErrorsType} from "../../input-output-types/output-errors-type";
import {postMongoRepository} from "../postMongoRepository";
import {ObjectId} from "mongodb";

export const deletePostController = async (req: Request<{ id: string }>, res: Response<PostOutputType | OutputErrorsType>,) => {
    const postId=req.params.id
    //ObjectId.isValid(postId) Проверка что это ObjectId
    if(!postId && ObjectId.isValid(postId)){
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