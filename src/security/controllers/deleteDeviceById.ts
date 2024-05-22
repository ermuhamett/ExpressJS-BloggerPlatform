import {SecurityService} from "../securityService";
import {Request, Response} from "express";
import {SecurityQueryRepository} from "../securityQueryRepository";
export const deleteDeviceById = async (req: Request, res: Response) => {
    const deviceId=req.params.deviceId
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.sendStatus(401)
    }
    const authSession = await SecurityService.checkAuthSessionByRefreshToken(refreshToken)
    if (!authSession) {
        return res.sendStatus(401)
    }
    const deletedAuthSession=await SecurityQueryRepository.getAuthSessionByDeviceId(deviceId)
    if(!deletedAuthSession){
        return res.sendStatus(404)
    }
    if(deletedAuthSession.userId !== authSession.userId){
        return res.sendStatus(403)
    }
    const isDeleted=await SecurityService.deleteSessionById(req.params.deviceId)
    if(!isDeleted){
        return res.sendStatus(401)
    }
    return res.sendStatus(204)
}