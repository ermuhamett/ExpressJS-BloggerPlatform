import {Request,Response} from "express";
import {postRepository} from "./postRepository";


export const createPostController=async (req:Request,res:Response)=>{
    const createInfo= await postRepository.create(req.body)
    if (!createInfo.id){
        res.status(500).json({})
        return
    }
    const newPost = await postRepository.findForOutput(createInfo.id)
    res.status(201).json(newPost)
}