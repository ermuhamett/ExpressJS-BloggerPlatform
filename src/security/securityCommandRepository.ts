import {AuthSessionMongooseModel} from "../db/mongoose/models";
import {injectable} from "inversify";

@injectable()
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
