import {Request, Response} from "express";
import {UserService} from "../user-service";
import {userMongoRepository} from "../userMongoRepository";
import {ObjectId} from "mongodb";
import {userMongoQueryRepository} from "../userMongoQueryRepository";

export const createUserController=async (req:Request, res:Response)=>{
    const createdUserId=await UserService.createUser(req.body)
    if(!createdUserId){
        return res.sendStatus(509)
    }
    const createdUser=await userMongoQueryRepository.findForOutput(new ObjectId(createdUserId.id))
    if(!createdUser){
        res.sendStatus(400)
        return
    }
    return res.status(201).json(createdUser)
}