import {Request, Response} from "express";
import {UserService} from "./user-service";
import {UserQueryRepository} from "./userQueryRepository";
import {ObjectId} from "mongodb";
import {helper, QueryOutputType} from "../middleware/helper";
import {UserCommandRepository} from "./userCommandRepository";
import mongoose from "mongoose";
import {inject, injectable} from "inversify";

@injectable()
export class UserController{
    constructor(@inject(UserService) readonly userService:UserService,
                @inject(UserCommandRepository) readonly userCommandRepository:UserCommandRepository,
                @inject(UserQueryRepository) readonly userQueryRepository:UserQueryRepository) {}
    async createUser(req:Request, res:Response){
        const createdUserId=await this.userService.createUser(req.body)
        if(!createdUserId){
            return res.sendStatus(509)
        }
        const createdUser=await this.userQueryRepository.findForOutput(new mongoose.Types.ObjectId(createdUserId.id))
        if(!createdUser){
            res.sendStatus(400)
            return
        }
        return res.status(201).json(createdUser)
    }
    async getUsers(req: Request, res: Response){
        const sanitizedQuery:QueryOutputType=helper(req.query)
        const users=await this.userQueryRepository.getMany(sanitizedQuery)
        if(!users){
            res.sendStatus(404)
            return
        }
        res.status(200).json(users)
    }
    async deleteUserById(req:Request, res:Response){
        const userId=req.params.id
        if (!userId && ObjectId.isValid(userId)) {
            res.sendStatus(400)
            return;
        }
        const isDeleted=await this.userCommandRepository.deleteUserById(new ObjectId(userId))
        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204) //Success:No Content
    }
}