import {Request, Response} from "express";
import {AuthService} from "../auth-service";

export const confirmRegistrationController = async(req:Request, res:Response) => {
    const result=await AuthService.confirmEmail(req.body.code)
    if(result){
        res.sendStatus(204)
    } else{
        res.sendStatus(400)
    }
}