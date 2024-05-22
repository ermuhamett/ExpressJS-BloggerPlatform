import {ITokenInfo} from "../../types/auth-db-type";
import {tokenCollection} from "../../db/mongo-db";

export class TokenMongoRepository {
    static async addToken(createToken: ITokenInfo) {
        await tokenCollection.insertOne(createToken);
    }
    static async findTokenByUser(userId: string): Promise<ITokenInfo | null> {
        try {
            return await tokenCollection.findOne({userId: userId});
        } catch (error) {
            console.error("Error finding token by user:", error);
            throw error;
        }
    }
    static async deleteOldToken(userId: string) {
        try {
            const result = await tokenCollection.deleteOne({userId: userId})
            return result.deletedCount === 1;
        } catch (error) {
            throw new Error('Failed to delete post');
        }
    }
    static async invalidateToken(userId: string) {
        await tokenCollection.updateOne({userId: userId}, {$set: {isValid: false}})
    }
}