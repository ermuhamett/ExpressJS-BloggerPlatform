import {Request,Response} from "express";
import {BlogService} from "../blog-service";
import {blogMongoQueryRepository} from "../blogMongoQueryRepository";
import {ObjectId} from "mongodb";
export const createBlogController=async (req:Request,res:Response)=>{
    const createdBlogId=await BlogService.createBlog(req.body)
    if(!createdBlogId){
        return res.sendStatus(500)
    }
    const createdBlog=await blogMongoQueryRepository.findForOutput(new ObjectId(createdBlogId.id))
    if (!createdBlog) {
        return res.status(500).json({})
    }
    return res.status(201).json(createdBlog)
}