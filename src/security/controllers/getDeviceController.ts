import {Request, Response} from "express";
import {SecurityService} from "../securityService";
import {SecurityQueryRepository} from "../securityQueryRepository";
export const getDevicesController = async (req:Request, res:Response) => {
    const refreshToken=req.cookies.refreshToken
    //console.log(refreshToken)
    if(!refreshToken){
        return res.sendStatus(401)
    }
    const authSession=await SecurityService.checkAuthSessionByRefreshToken(refreshToken)
    console.log(authSession)
    if(!authSession){
        return res.sendStatus(401)
    }
    const userDevices=await SecurityQueryRepository.getDevices(authSession.userId)
    console.log(userDevices)
    return res.status(200).send(userDevices)
}