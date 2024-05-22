import {UserCommandRepository} from "./userCommandRepository";
import {IUserInputModel} from "../types/user-db-type";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add"
import {IUserAccountDbModel} from "../types/auth-db-type";
export class UserService{
    constructor(private readonly userCommandRepository:UserCommandRepository) {}
    async createUser(input: IUserInputModel):Promise<{ error?: string, id?: ObjectId }> {
        const passwordHash = await bcryptService.generateHash(input.password);
        try {
            const user: IUserAccountDbModel = {
                login: input.login,
                email: input.email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode:uuidv4(),
                    confirmationCodeExpirationDate:add(new Date(), {
                        hours:1,
                        minutes:30
                    }),
                    isConfirmed:false
                }
            };
            const newUserId = await this.userCommandRepository.createUser(user);
            if (!newUserId) return {error:"Id не существует"};
            return newUserId
        } catch (error) {
            console.error('Error creating user:', error);
            return  {error:"Id не существует"};
        }
    }
}