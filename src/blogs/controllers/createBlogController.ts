import {Request,Response} from "express";
import {blogMongoRepository} from "../blogMongoRepository";

export const createBlogController=async(req:Request, res:Response)=>{
    const createId=await blogMongoRepository.create(req.body);
    if (!createId.id){
        res.status(500).json({})
        return
    }
    const newBlog=await blogMongoRepository.findForOutput(createId.id)
    res.status(201).json(newBlog)
}