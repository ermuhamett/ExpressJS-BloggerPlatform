import {Request,Response} from "express";
import {PostOutputType} from "../../db/post-db-type";
import {postMongoRepository} from "../postMongoRepository";
export const getPostsController=async (req:Request, res:Response<PostOutputType[]>)=>{
    const posts= await postMongoRepository.getAll()
    if(!posts){
        res.sendStatus(404)
        return
    }
    res.status(200).json(posts)
}