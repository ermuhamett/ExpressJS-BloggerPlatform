import {Request, Response} from "express";
import {SecurityService} from "../securityService";
export const deleteDevicesController = async(req:Request, res:Response) => {
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        return res.sendStatus(401)
    }
    const authSession=await SecurityService.checkAuthSessionByRefreshToken(refreshToken)
    if(!authSession){
        return res.sendStatus(401)
    }
    const deletedCount=await SecurityService.deleteAllOtherSessions(authSession.deviceId, refreshToken)
    return res.sendStatus(204)
}