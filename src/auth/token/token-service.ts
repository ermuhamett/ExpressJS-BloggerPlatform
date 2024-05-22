import {ITokenInfo} from "../../types/auth-db-type";
import {ObjectId} from "mongodb";
import {TokenMongoRepository} from "./tokenMongoRepository";
export class TokenService {
    static async addTokenInfo(userId:ObjectId, createdAt:number){
        const tokenInfo:ITokenInfo={
            userId:userId.toString(),
            createdAt:createdAt.toString(),
        }
        await TokenMongoRepository.addToken(tokenInfo)
        return true
    }
}