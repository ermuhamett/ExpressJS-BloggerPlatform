import {QueryOutputType} from "../middleware/helper";
import {ObjectId, WithId} from "mongodb";
import {IUserDbMongo, IUserOutputModel} from "../types/user-db-type";
import {userCollection} from "../db/mongo-db";
import {userMapper} from "../mapper/mapper";
import {IUserAccountDbModel} from "../types/auth-db-type";

export const userMongoQueryRepository = {
    async find(id: ObjectId) {
        return await userCollection.findOne({_id: id})
    },
    async findForOutput(id: ObjectId): Promise<null | IUserOutputModel> {
        try {
            const user = await this.find(new ObjectId(id));
            return user ? userMapper(user) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
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
            const items: WithId<IUserAccountDbModel>[] = await userCollection
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray()
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