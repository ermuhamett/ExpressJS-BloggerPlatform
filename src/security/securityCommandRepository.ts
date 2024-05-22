import {AuthSessionMongooseModel} from "../db/mongoose/models";
export class SecurityCommandRepository {
    async deleteAllOtherSessions(userDevicesIdsWithoutCurrent:string[]){
        const result=await AuthSessionMongooseModel.deleteMany({deviceId:{$in:userDevicesIdsWithoutCurrent}})
        return result.deletedCount
    }
    async deleteSessionById(deviceId:string){
        const result=await AuthSessionMongooseModel.deleteOne({deviceId})
        return Boolean(result.deletedCount)
    }
}
/*export class SecurityCommandRepository{
    static async deleteAllOtherSessions(userDevicesIdsWithoutCurrent:string[]){
        const result=await authSessionCollection.deleteMany({deviceId:{$in:userDevicesIdsWithoutCurrent}})
        return result.deletedCount
    }
    static async deleteSessionById(deviceId:string){
        const result=await authSessionCollection.deleteOne({deviceId})
        return Boolean(result.deletedCount)
    }
}*/