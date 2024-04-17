import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {userMongoRepository} from "../userMongoRepository";
export const deleteUserController=async(req:Request, res:Response)=>{
    const userId=req.params.id
    if (!userId && ObjectId.isValid(userId)) {
        res.sendStatus(400)
        return;
    }
    const isDeleted=await userMongoRepository.deleteUserById(new ObjectId(userId))
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204) //Success:No Content
}