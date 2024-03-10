import {Request,Response} from "express";
import {blogRepository} from "./blogRepository";

export const createBlogController=async(req:Request, res:Response)=>{
    const createInfo=await blogRepository.create(req.body);
    if (!createInfo.id){
        res.status(500).json({})
        return
    }
    const newBlog=await blogRepository.findForOutput(createInfo.id)
    res.status(201).json(newBlog)
}