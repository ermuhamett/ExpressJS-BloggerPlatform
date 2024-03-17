import {Request,Response} from "express";
import {postMongoRepository} from "../postMongoRepository";
import {ObjectId} from "mongodb";


export const createPostController=async (req:Request,res:Response)=>{
    const createdId= await postMongoRepository.create(req.body)
    if (!createdId.id){
        res.status(500).json({})
        return
    }
    //const newPost = await postMongoRepository.findForOutput(new ObjectId(req.params.id))
    //createInfo.id.toString()
    const newPost= await postMongoRepository.findForOutput(createdId.id)
    res.status(201).json(newPost)
}