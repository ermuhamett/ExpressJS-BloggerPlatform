import {Request, Response} from "express";
import {userMongoRepository} from "./userMongoRepository";
import {IUserOutputModel} from "../db/user-db-type";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {ObjectId} from "mongodb";

export const userService={
    async createUser(req:Request, res:Response){
        const createdUser=await userMongoRepository.create(req.body)
        if (!createdUser.id) {
            res.status(500).json({})
            return
        }
        const newUser=await userMongoRepository.findForOutput(createdUser.id)
        return res.status(201).json(newUser)
    },
    async deleteUser(req:Request<{ id: string }>, res:Response<IUserOutputModel | OutputErrorsType>){
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
}