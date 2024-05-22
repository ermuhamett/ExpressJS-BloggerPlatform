import {jwtService} from "../common/adapters/jwt.service";
import {SecurityQueryRepository} from "./securityQueryRepository";
import {JwtPayload} from "jsonwebtoken";
import {SecurityCommandRepository} from "./securityCommandRepository";
export class SecurityService {
    constructor(readonly securityCommandRepository: SecurityCommandRepository, readonly securityQueryRepository: SecurityQueryRepository) {}
    async checkAuthSessionByRefreshToken(refreshToken:string){
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return false
        }
        const authSession=await this.securityQueryRepository.findAuthSession(tokenData.userId, tokenData.deviceId, tokenData?.iat);
        console.log(authSession)
        return authSession
    }
    async deleteAllOtherSessions(currentDeviceId: string, refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return false
        }
        const userDevices = await this.securityQueryRepository.getDevices(tokenData.userId)
        const userDevicesIdsWithoutCurrent = userDevices
            .map((deviceData) => deviceData.deviceId)
            .filter((deviceId)=>deviceId!==currentDeviceId)
        return await this.securityCommandRepository.deleteAllOtherSessions(userDevicesIdsWithoutCurrent)
        //TODO Надо написать код контроллера который удаляет все девайсы
    }
    async deleteSessionById(deviceId:string){
        return this.securityCommandRepository.deleteSessionById(deviceId)
    }
}

/*export class SecurityService {
    static async checkAuthSessionByRefreshToken(refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        console.log(tokenData)
        if (!tokenData) {
            return false
        }
        const authSession=await SecurityQueryRepository.findAuthSession(tokenData.userId, tokenData.deviceId, tokenData?.iat);
        console.log(authSession)
        return authSession
    }
    static async deleteAllOtherSessions(currentDeviceId: string, refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return false
        }
        const userDevices = await SecurityQueryRepository.getDevices(tokenData.userId)
        const userDevicesIdsWithoutCurrent = userDevices
            .map((deviceData) => deviceData.deviceId)
            .filter((deviceId)=>deviceId!==currentDeviceId)
        return await SecurityCommandRepository.deleteAllOtherSessions(userDevicesIdsWithoutCurrent)
        //TODO Надо написать код контроллера который удаляет все девайсы
    }
    static async deleteSessionById(deviceId:string){
        return SecurityCommandRepository.deleteSessionById(deviceId)
    }
    static async v2DeleteAllOtherSessions(currentDeviceId: string, refreshToken: string){
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload;
        if (!tokenData) {
            return false;
        }
        try {
            // Получаем идентификаторы устройств пользователя
            const userDeviceIds = await SecurityQueryRepository.getDeviceIds(tokenData.userId);
            // Удаляем текущее устройство из списка
            userDeviceIds.delete(currentDeviceId);
            // Преобразуем Set обратно в массив (если это необходимо)
            const userDevicesIdsWithoutCurrent = Array.from(userDeviceIds);
            // Удаляем все сеансы, кроме текущего устройства
            return await SecurityCommandRepository.deleteAllOtherSessions(userDevicesIdsWithoutCurrent);
        } catch (error) {
            console.error('Error deleting other sessions:', error);
            throw new Error('Error deleting other sessions');
        }
    }
}*/