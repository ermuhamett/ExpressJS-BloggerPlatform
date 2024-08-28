import {SecurityService} from "./securityService";
import {Request, Response} from "express";
import {SecurityQueryRepository} from "./securityQueryRepository";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityController {
    constructor(@inject(SecurityService) readonly securityService:SecurityService,
                @inject(SecurityQueryRepository) readonly securityQueryRepository:SecurityQueryRepository) {}
    async getDevices(req:Request, res:Response){
        const refreshToken=req.cookies.refreshToken
        if(!refreshToken){
            return res.sendStatus(401)
        }
        const authSession=await this.securityService.checkAuthSessionByRefreshToken(refreshToken)
        console.log(authSession)
        if(!authSession){
            return res.sendStatus(401)
        }
        const userDevices=await this.securityQueryRepository.getDevices(authSession.userId)
        console.log(userDevices)
        return res.status(200).send(userDevices)
    }
    async deleteDeviceById(req:Request, res:Response){
        const deviceId=req.params.deviceId
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.sendStatus(401)
        }
        const authSession = await this.securityService.checkAuthSessionByRefreshToken(refreshToken)
        if (!authSession) {
            return res.sendStatus(401)
        }
        const deletedAuthSession=await this.securityQueryRepository.getAuthSessionByDeviceId(deviceId)
        if(!deletedAuthSession){
            return res.sendStatus(404)
        }
        if(deletedAuthSession.userId !== authSession.userId){
            return res.sendStatus(403)
        }
        const isDeleted=await this.securityService.deleteSessionById(req.params.deviceId)
        if(!isDeleted){
            return res.sendStatus(401)
        }
        return res.sendStatus(204)
    }
    async deleteDevices(req:Request, res:Response){
        const refreshToken=req.cookies.refreshToken
        if(!refreshToken){
            return res.sendStatus(401)
        }
        const authSession=await this.securityService.checkAuthSessionByRefreshToken(refreshToken)
        if(!authSession){
            return res.sendStatus(401)
        }
        const deletedCount=await this.securityService.deleteAllOtherSessions(authSession.deviceId, refreshToken)
        return res.sendStatus(204)
    }
}