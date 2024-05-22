import {ISessionInfo} from "../../types/auth-db-type";
import {authSessionCollection} from "../../db/mongo-db";

export class SessionMongoRepository {
    static async createAuthSession(authSession: ISessionInfo) {
        const result = await authSessionCollection.insertOne(authSession)
        return result.insertedId
    }
    static async isAuthSessionExist(userId: string, deviceId: string, createdAt: number) {
        const authSession = await authSessionCollection.findOne({userId, deviceId, createdAt})
        return Boolean(authSession)
    }
    static async updateAuthSession(userId: string, deviceId: string, createdAt: number) {
        const result = await authSessionCollection.updateOne({userId, deviceId}, {$set: {createdAt}})
        return Boolean(result.modifiedCount)
    }
    static async deleteAuthSession(userId:string, deviceId:string, createdAt:number){
        const result=await authSessionCollection.deleteOne({userId,deviceId,createdAt})
        return Boolean(result.deletedCount)
    }
}