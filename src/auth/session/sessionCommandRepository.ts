import {ISessionInfo} from "../../types/auth-db-type";
import {AuthSessionMongooseModel} from "../../db/mongoose/models";
import {injectable} from "inversify";

@injectable()
export class SessionCommandRepository {
    async createAuthSession(authSession: ISessionInfo) {
        try {
            const result = await AuthSessionMongooseModel.create(authSession)
            return result._id
        } catch (error) {
            console.error('Error creating auth session:', error);
            throw new Error('Failed to create auth session');
        }
    }
    async isAuthSessionExist(userId: string, deviceId: string, createdAt: number) {
        try {
            const authSession = await AuthSessionMongooseModel.findOne({userId, deviceId, createdAt});
            return Boolean(authSession);
        } catch (error) {
            console.error('Error checking auth session existence:', error);
            throw new Error('Failed to check auth session existence');
        }
    }
    async updateAuthSession(userId: string, deviceId: string, createdAt: number) {
        try {
            const updatedSession = await AuthSessionMongooseModel.updateOne({
                userId,
                deviceId
            }, {$set: {createdAt}}, {new: true});
            return !!updatedSession; // Возвращает true, если документ был обновлен
        } catch (error) {
            console.error('Error updating auth session:', error);
            throw new Error('Failed to update auth session');
        }
    }
    async deleteAuthSession(userId: string, deviceId: string, createdAt: number) {
        try {
            const result = await AuthSessionMongooseModel.deleteOne({userId, deviceId, createdAt});
            return Boolean(result.deletedCount);// Возвращает true, если был удален хотя бы один документ
        } catch (error) {
            console.error('Error deleting auth session:', error);
            throw new Error('Failed to delete auth session');
        }
    }
}