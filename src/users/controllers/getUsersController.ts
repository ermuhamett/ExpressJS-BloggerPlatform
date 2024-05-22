import {Request, Response} from "express";
import {helper, QueryOutputType} from "../../middleware/helper";
import {userMongoQueryRepository} from "../userMongoQueryRepository";

export const getUsersController=async (req: Request, res: Response)=>{
    const sanitizedQuery:QueryOutputType=helper(req.query)
    const users=await userMongoQueryRepository.getMany(sanitizedQuery)
    if(!users){
        res.sendStatus(404)
        return
    }
    res.status(200).json(users)
}