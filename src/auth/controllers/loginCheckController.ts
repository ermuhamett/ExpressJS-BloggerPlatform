import {Request, Response} from "express";
import {AuthService} from "../auth-service";
export const loginCheckController = async(req:Request, res:Response) => {
    const deviceName=req.headers['user-agent'] ?? 'Your device'
    const ip=req.ip ?? 'no_ip'
    const user=await AuthService.loginUser(req.body)
    if(!user){
        return res.sendStatus(401)
    }
    const tokens=await AuthService.createPairTokens(user._id.toString(), deviceName,ip)
    if(!tokens){
        return res.sendStatus(401)
    }
    res.cookie('refreshToken',tokens.refreshToken,{httpOnly: true,secure: true})// Установка куки с refreshToken
    return res.status(200).send({accessToken:tokens.accessToken})
}