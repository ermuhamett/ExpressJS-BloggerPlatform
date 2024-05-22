import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {postMongoQueryRepository} from "../postMongoQueryRepository";
import {PostService} from "../post-service";
import {commentQueryMongoRepository} from "../../comments/commentQueryMongoRepository";
export const createCommentController=async(req: Request, res: Response)=>{
    const {content}= req.body;
    const {id, login} = req.user!
    const { postId } = req.params; // Получаем postId из параметров маршрута
    // Проверяем существование поста с указанным postId
    if(!ObjectId.isValid(postId)){
        return res.status(400).json({ error: "Invalid postId" });
    }
    const post = await postMongoQueryRepository.find(new ObjectId(postId));
    if (!post) {
        return res.status(404).json({ error: "Post not found" });
    }
    const createdCommentId=await PostService.createComment(content,{id, login},postId)
    if(!createdCommentId){
        return res.sendStatus(500)
    }
    const createdComment=await commentQueryMongoRepository.findForOutput(new ObjectId(createdCommentId.id))
    if(createdComment){
        return res.status(201).json(createdComment)
    } else{
        res.status(500).json({error:"Internal Server Error inside Controller"})
        return
    }
}