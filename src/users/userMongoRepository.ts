import {ObjectId} from "mongodb";
import {userCollection} from "../db/mongo-db";
import {IUserAccountDbModel} from "../types/auth-db-type";

export const userMongoRepository = {
    async createUser(createdData: IUserAccountDbModel): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const result = await userCollection.insertOne(createdData);
            return {id: result.insertedId};
        } catch (e) {
            return {error: 'Error'}
        }
    },
    async updateUserById(id: ObjectId, updateData:Partial<IUserAccountDbModel>):Promise<boolean | null>{
        try {
            const updatedUser = await userCollection.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { returnDocument: 'after' } // Этот параметр говорит MongoDB вернуть обновленный документ
            );
            return !!updatedUser;
        } catch (error) {
            console.error('Error updating user by id:', error);
            return false;
        }
    },
    async deleteUserById(id: ObjectId): Promise<boolean> {
        try {
            const result = await userCollection.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (e) {
            throw new Error('Failed to delete user');
        }
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return await userCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findUserByConfirmationCode(emailConfirmationCode:string){
        return await userCollection.findOne({"emailConfirmation.confirmationCode": emailConfirmationCode})
    },
    async updateConfirmation(id:ObjectId){
        return await userCollection.updateOne({_id:id}, {$set: {"emailConfirmation.isConfirmed": true}})
    },

}