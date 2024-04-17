import {Request, Response} from "express";
import {ILoginInputModel} from "../../types/auth-db-type";
import {AuthService} from "../auth-service";

export const loginCheckController = async(req:Request<ILoginInputModel>, res:Response) => {
    const token=await AuthService.loginUser(req.body)
    if(!token){
        res.sendStatus(401)
        return
    }
    res.status(200).send({accessToken:token})
}