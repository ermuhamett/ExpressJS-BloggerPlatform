import {IUserAccountDbModel} from "../types/auth-db-type";
import {UsersMongooseModel} from "../db/mongoose/models";
import mongoose from "mongoose";
import {UserDocument} from "../db/mongoose/schemas";
export class UserCommandRepository{
    async createUser(createdData: IUserAccountDbModel): Promise<{ error?: string, id?: mongoose.Types.ObjectId }> {
        try {
            const result = await UsersMongooseModel.create(createdData);
            return {id: result._id};
        } catch (error) {
            console.error('Error creating user:', error);
            return { error: 'Error creating user' };
        }
    }
    async updateUserById(id: mongoose.Types.ObjectId, updateData:Partial<IUserAccountDbModel>):Promise<boolean | null>{
        console.error(updateData, " updateData in updateUserById")
        try {
            const updatedUser = await UsersMongooseModel.findOneAndUpdate( {_id: id}, updateData, { new: true  });
            console.log(updatedUser, " updated user")
            return !!updatedUser;
        } catch (error) {
            console.error('Error updating user by id:', error);
            return false;
        }
    }
    async deleteUserById(id: mongoose.Types.ObjectId): Promise<boolean> {
        try {
            const result = await UsersMongooseModel.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Error deleting user by id:', error);
            throw new Error('Failed to delete user');
        }
    }
    async updateConfirmation(id: mongoose.Types.ObjectId): Promise<boolean> {
        try {
            const result = await UsersMongooseModel.updateOne({ _id: id }, { $set: { "emailConfirmation.isConfirmed": true } });
            return result.modifiedCount  === 1;
        } catch (error) {
            console.error('Error updating confirmation status:', error);
            return false;
        }
    }
}
