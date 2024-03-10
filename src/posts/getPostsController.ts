import {Request,Response} from "express";
import {postRepository} from "./postRepository";
import {PostOutputType} from "../db/post-db-type";
export const getPostsController=async (req:Request, res:Response<PostOutputType[]>)=>{
    const posts= await postRepository.getAll()
    res.status(200).json(posts)
}