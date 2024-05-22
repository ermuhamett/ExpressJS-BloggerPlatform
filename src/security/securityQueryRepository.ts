import {authSessionCollection} from "../db/mongo-db";
import {deviceMapper} from "../mapper/mapper";
import {ISessionInfo} from "../types/auth-db-type";

export class SecurityQueryRepository {
    static async getDevices(userId:string) {
        const authSession=await authSessionCollection.find({userId}).toArray()
        return authSession.map(deviceMapper)
    }
    static async getDeviceIds(userId:string):Promise<Set<string>>{
        try {
            // Ищем все сессии пользователя по userId
            const userSessionsCursor = await authSessionCollection.find({userId}).toArray()
            const userDeviceIds = new Set<string>();
            // Проходим по всем найденным сессиям
            await userSessionsCursor.forEach((session: ISessionInfo) => {
                // Добавляем идентификатор устройства в набор
                userDeviceIds.add(session.deviceId);
            });
            return userDeviceIds;
        }
        catch (error) {
            console.error('Error getting device ids:', error);
            throw new Error('Error getting device ids');
        }
    }
    static async getAuthSessionByDeviceId(deviceId:string) {
        return await authSessionCollection.findOne({deviceId})
    }
    static async findAuthSession(userId: string, deviceId: string, createdAt?: number) {
        return await authSessionCollection.findOne({userId, deviceId, createdAt})
    }
}