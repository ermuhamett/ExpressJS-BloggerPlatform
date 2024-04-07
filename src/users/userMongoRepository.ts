import {IUserDbMongo, IUserInputModel, IUserOutputModel} from "../types/user-db-type";
import {ObjectId} from "mongodb";
import {postCollection, userCollection} from "../db/mongo-db";
import {userMapper} from "../mapper/mapper";
import {bcryptService} from "../common/adapters/bcrypt.service";

export const userMongoRepository = {
    async create(input: IUserInputModel): Promise<{ error?: string, id?: ObjectId }> {
        const passwordHash = await bcryptService.generateHash(input.password)
        const user: IUserDbMongo = {
            login: input.login,
            email: input.email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        }
        try {
            const insertedInfo = await userCollection.insertOne(user)
            console.log(insertedInfo)
            return {id: insertedInfo.insertedId};
        } catch (e) {
            return {error: 'Error'}
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
    async find(id: ObjectId) {
        return await userCollection.findOne({_id: id})
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return await userCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },
    async findForOutput(id: ObjectId): Promise<null | IUserOutputModel> {
        try {
            const user = await this.find(new ObjectId(id));
            return user ? userMapper(user) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
}