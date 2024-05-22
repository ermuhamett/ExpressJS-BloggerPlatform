import {Request, Response} from "express";
import {AuthService} from "../auth-service";
export const emailResendingController = async(req:Request, res:Response) => {
    const registerUser=await AuthService.resendingEmail(req.body.email)
    if(registerUser){
        res.sendStatus(204)
    } else{
        res.sendStatus(400)
    }
}