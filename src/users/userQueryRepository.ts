import {QueryOutputType} from "../middleware/helper";
import {ObjectId} from "mongodb";
import {IUserOutputModel} from "../types/user-db-type";
import {userCollection} from "../db/mongo-db";
import {userMapper} from "../mapper/mapper";
import {UserDocument} from "../db/mongoose/schemas";
import {UsersMongooseModel} from "../db/mongoose/models";
import mongoose from "mongoose";
export class UserQueryRepository{
    async find(id: mongoose.Types.ObjectId) {
        return UsersMongooseModel.findOne({_id: id})
    }
    async findForOutput(id: mongoose.Types.ObjectId): Promise<null | IUserOutputModel> {
        try {
            const user = await this.find(new ObjectId(id));
            return user ? userMapper(user) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        try {
            return await UsersMongooseModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
        } catch (error) {
            console.error('Error finding user by login or email:', error);
            return null;
        }
    }
    async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserDocument | null> {
        try {
            return await UsersMongooseModel.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
        } catch (error) {
            console.error('Error finding user by confirmation code:', error);
            return null;
        }
    }
    async getUserByRecoveryCode(recoveryCode:string){
        try {
            return await UsersMongooseModel.findOne({ "emailConfirmation.passwordRecoveryCode": recoveryCode });
        } catch (error) {
            console.error('Error finding user by recovery code:', error);
            return null;
        }
    }
    async getMany(query: QueryOutputType) {
        const searchByLogin = {login: {$regex: query.searchLoginTerm ?? '', $options: 'i'}}
        const searchByEmail = {email: {$regex: query.searchEmailTerm ?? '', $options: 'i'}}
        // Объединяем поисковые запросы
        const filter = {
            $or: [
                searchByLogin,
                searchByEmail
            ]
        };
        const totalCount = await userCollection.countDocuments(filter)
        const pageCount = Math.ceil(totalCount / query.pageSize)
        try {
            const items: UserDocument[] = await UsersMongooseModel
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(userMapper)
            }
        } catch (e) {
            //Фича можно отловить ошибку то есть где именно падает и тд
            console.log({get_users_repo: e})
            return false
        }
    }
}
