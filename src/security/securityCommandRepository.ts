import {authSessionCollection} from "../db/mongo-db";

export class SecurityCommandRepository {
    static async deleteAllOtherSessions(userDevicesIdsWithoutCurrent:string[]){
        const result=await authSessionCollection.deleteMany({deviceId:{$in:userDevicesIdsWithoutCurrent}})
        return result.deletedCount
    }
    static async deleteSessionById(deviceId:string){
        const result=await authSessionCollection.deleteOne({deviceId})
        return Boolean(result.deletedCount)
    }
}