import {ILoginInputModel, ISessionInfo} from "../types/auth-db-type";
import {userMongoRepository} from "../users/userMongoRepository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {IUserInputModel} from "../types/user-db-type";
import {emailService} from "../common/adapters/email.service";
import {UserService} from "../users/user-service";
import {ObjectId} from "mongodb";
import {userMongoQueryRepository} from "../users/userMongoQueryRepository";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {jwtService} from "../common/adapters/jwt.service";
import {JwtPayload} from "jsonwebtoken";
import {SessionMongoRepository} from "./session/sessionMongoRepository";
import {log} from "util";

export class AuthService {
    static async createPairTokens(userId: string, deviceName: string, ip: string) {
        //Создаем пару токенов дальше создаем сессию в коллекции потом возвращаем обратно токены
        const deviceId = uuidv4()
        const {accessToken, refreshToken} = await jwtService.createPairToken(userId, deviceId)
        if (!accessToken || !refreshToken) {
            return false
        }
        await this.createAuthSession(refreshToken, userId, deviceName, ip)
        return {accessToken, refreshToken}
    }
    static async updatePairTokens(refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return Promise.reject('Token data is invalid')
        }
        const userId = tokenData.userId;
        const user = await userMongoQueryRepository.findForOutput(new ObjectId(userId))
        const hasAuthSession = await SessionMongoRepository.isAuthSessionExist(userId.toString(), tokenData.deviceId, tokenData?.iat ?? 0)
        if (!userId || !user || !hasAuthSession) {
            return Promise.reject('User not found in collection')
        }
        const{accessToken, refreshToken:updatedRefreshToken}=await jwtService.createPairToken(userId,tokenData.deviceId)
        if(!accessToken || !updatedRefreshToken){
            return Promise.reject('Error in update tokens')
        }
        await this.updateAuthSession(userId, updatedRefreshToken)
        return Promise.resolve({accessToken, refreshToken: updatedRefreshToken})
    }
    static async loginUser(input: ILoginInputModel) {
        const user = await userMongoRepository.findByLoginOrEmail(input.loginOrEmail)
        if (!user) return false;
        const isCorrectPassword = await bcryptService.checkPassword(input.password, user.passwordHash)
        if (!isCorrectPassword) return false;
        return user
    }
    static async logoutUser(refreshToken:string){
        const tokenData=await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return Promise.reject('Token data is invalid')
        }
        const userId=tokenData.userId;
        const user = await userMongoQueryRepository.findForOutput(new ObjectId(userId))
        if (!userId || !user) {
            return Promise.reject('User not found in collection')
        }
        const hasAuthSession = await SessionMongoRepository.isAuthSessionExist(userId.toString(), tokenData.deviceId, tokenData?.iat ?? 0)
        if(!hasAuthSession){
            return Promise.reject('Session not found')
        }
        await SessionMongoRepository.deleteAuthSession(userId,tokenData.deviceId, tokenData?.iat ?? 0)
        return Promise.resolve()
    }

    static async registerUser(input: IUserInputModel) {
        try {
            // Создание пользователя
            const createResultId = await UserService.createUser(input);
            if (!createResultId) {
                console.error('Failed to create user');
                return null;
            }
            const createUser = await userMongoQueryRepository.find(new ObjectId(createResultId.id))
            if (!createUser) {
                return null
            }
            // Отправка письма с подтверждением
            try {
                await emailService.sendEmail(createUser.email, createUser.emailConfirmation.confirmationCode);
                return createUser;
            } catch (e) {
                console.error('Send email error', e);
                // Можно здесь добавить код для удаления пользователя, если отправка письма не удалась
                return null;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    static async confirmEmail(code: string) {
        const user = await userMongoRepository.findUserByConfirmationCode(code)
        console.log(user)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;
        return await userMongoRepository.updateConfirmation(user._id)
    }

    static async resendingEmail(email: string) {
        const user = await userMongoRepository.findByLoginOrEmail(email)
        console.log(user)
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        // Генерируем новый код подтверждения и обновляем дату истечения срока его действия
        const newConfirmationCode = uuidv4();
        const expirationDate = add(new Date(), {
            hours: 1,
            minutes: 30
        }); // Установите новый срок действия здесь
        // Обновляем код подтверждения и срок его действия в базе данных
        try {
            await userMongoRepository.updateUserById(user._id, {
                emailConfirmation: {
                    confirmationCode: newConfirmationCode,
                    expirationDate: expirationDate,
                    isConfirmed: user.emailConfirmation.isConfirmed // Передаем текущее значение isConfirmed
                }
            });
        } catch (error) {
            console.error('Error updating confirmation code and expiration date:', error);
            return false;
        }
        // Отправка письма с подтверждением
        try {
            await emailService.sendEmail(email, newConfirmationCode);
            return user;
        } catch (e) {
            console.error('Send email error', e);
            // Можно здесь добавить код для удаления пользователя, если отправка письма не удалась
            return null;
        }
    }

    static async createAuthSession(refreshToken: string, userId: string, deviceName: string, ip: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return false
        }
        const sessionInfo: ISessionInfo = {
            userId,
            deviceId: tokenData.deviceId,
            deviceName,
            ip,
            createdAt: tokenData.iat!,
            expirationDate: tokenData.exp!
        }
        return await SessionMongoRepository.createAuthSession(sessionInfo)
    }
    static async updateAuthSession(userId:string,refreshToken:string){
        const updatedTokenData=await jwtService.decodeToken(refreshToken) as JwtPayload
        if(!updatedTokenData){
            return
        }
        await SessionMongoRepository.updateAuthSession(userId, updatedTokenData.deviceId, updatedTokenData?.iat ?? 0)
    }
}
