import {Request, Response, NextFunction} from "express";
import {ADMIN_AUTH} from "../posts";

export const authMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    const auth=req.headers['authorization'] as string //Basic xxxx
    console.log(auth)
    if(!auth){
        res.status(401).json({})
        return
    }
    const buff=Buffer.from(auth.slice(6), 'base64')
    const decodeAuth=buff.toString('utf-8')

    const buff2=Buffer.from(ADMIN_AUTH, 'utf-8')
    const codedAuth=buff2.toString('base64')

    if(auth.slice(6) !== codedAuth){
        res.status(401).json({})
        return;
    }
    next()
}