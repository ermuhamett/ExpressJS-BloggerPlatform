import {IEmailConfirmationModel, ILoginInputModel, ISessionInfo, IUserAccountDbModel} from "../types/auth-db-type";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {IUserInputModel} from "../types/user-db-type";
import {emailService} from "../common/adapters/email.service";
import {UserService} from "../users/user-service";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {jwtService} from "../common/adapters/jwt.service";
import {JwtPayload} from "jsonwebtoken";
import {SessionCommandRepository} from "./session/sessionCommandRepository";
import {UserCommandRepository} from "../users/userCommandRepository";
import {UserQueryRepository} from "../users/userQueryRepository";
import {UserDocument} from "../db/mongoose/schemas";
import {ResultStatus} from "../types/result.type";
import {errorMessagesHandleService} from "../common/adapters/errorMessageHandle.service";

export class AuthService {
    constructor(readonly userService: UserService,
                readonly userCommandRepository: UserCommandRepository,
                readonly userQueryRepository: UserQueryRepository,
                readonly sessionCommandRepository: SessionCommandRepository) {
    }

    async createPairTokens(userId: string, deviceName: string, ip: string) {
        //Создаем пару токенов дальше создаем сессию в коллекции потом возвращаем обратно токены
        const deviceId = uuidv4()
        const {accessToken, refreshToken} = await jwtService.createPairToken(userId, deviceId)
        if (!accessToken || !refreshToken) {
            return false
        }
        await this.createAuthSession(refreshToken, userId, deviceName, ip)
        return {accessToken, refreshToken}
    }

    async updatePairTokens(refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return Promise.reject('Token data is invalid')
        }
        const userId = tokenData.userId;
        const user = await this.userQueryRepository.findForOutput(new ObjectId(userId))
        const hasAuthSession = await this.sessionCommandRepository.isAuthSessionExist(userId.toString(), tokenData.deviceId, tokenData?.iat ?? 0)
        if (!userId || !user || !hasAuthSession) {
            return Promise.reject('User not found in collection')
        }
        const {
            accessToken,
            refreshToken: updatedRefreshToken
        } = await jwtService.createPairToken(userId, tokenData.deviceId)
        if (!accessToken || !updatedRefreshToken) {
            return Promise.reject('Error in update tokens')
        }
        await this.updateAuthSession(userId, updatedRefreshToken)
        return Promise.resolve({accessToken, refreshToken: updatedRefreshToken})
    }

    async loginUser(input: ILoginInputModel) {
        const user = await this.userQueryRepository.findByLoginOrEmail(input.loginOrEmail)
        if (!user) return false;
        const isCorrectPassword = await bcryptService.checkPassword(input.password, user.passwordHash)
        if (!isCorrectPassword) return false;
        return user
    }

    async logoutUser(refreshToken: string) {
        const tokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!tokenData) {
            return Promise.reject('Token data is invalid')
        }
        const userId = tokenData.userId;
        const user = await this.userQueryRepository.findForOutput(new ObjectId(userId))
        if (!userId || !user) {
            return Promise.reject('User not found in collection')
        }
        const hasAuthSession = await this.sessionCommandRepository.isAuthSessionExist(userId.toString(), tokenData.deviceId, tokenData?.iat ?? 0)
        if (!hasAuthSession) {
            return Promise.reject('Session not found')
        }
        await this.sessionCommandRepository.deleteAuthSession(userId, tokenData.deviceId, tokenData?.iat ?? 0)
        return Promise.resolve()
    }

    async registerUser(input: IUserInputModel) {
        try {
            // Создание пользователя
            const createResultId = await this.userService.createUser(input);
            if (!createResultId) {
                console.error('Failed to create user');
                return null;
            }
            const createUser = await this.userQueryRepository.find(new ObjectId(createResultId.id))
            if (!createUser) {
                return null
            }
            // Отправка письма с подтверждением
            try {
                await emailService.sendRegistrationEmail(createUser.email, createUser.emailConfirmation.confirmationCode);
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

    async confirmEmail(code: string) {
        const user = await this.userQueryRepository.findUserByConfirmationCode(code)
        console.log(user)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.confirmationCodeExpirationDate < new Date()) return false;
        return await this.userCommandRepository.updateConfirmation(user._id)
    }

    async resendingEmail(email: string) {
        const user = await this.userQueryRepository.findByLoginOrEmail(email)
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
            await this.userCommandRepository.updateUserById(user._id, {
                emailConfirmation: {
                    confirmationCode: newConfirmationCode,
                    confirmationCodeExpirationDate: expirationDate,
                    isConfirmed: user.emailConfirmation.isConfirmed // Передаем текущее значение isConfirmed
                }
            });
        } catch (error) {
            console.error('Error updating confirmation code and expiration date:', error);
            return false;
        }
        // Отправка письма с подтверждением
        try {
            await emailService.sendRegistrationEmail(email, newConfirmationCode);
            return user;
        } catch (e) {
            console.error('Send email error', e);
            // Можно здесь добавить код для удаления пользователя, если отправка письма не удалась
            return null;
        }
    }

    async createAuthSession(refreshToken: string, userId: string, deviceName: string, ip: string) {
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
        return await this.sessionCommandRepository.createAuthSession(sessionInfo)
    }

    async updateAuthSession(userId: string, refreshToken: string) {
        const updatedTokenData = await jwtService.decodeToken(refreshToken) as JwtPayload
        if (!updatedTokenData) {
            return
        }
        await this.sessionCommandRepository.updateAuthSession(userId, updatedTokenData.deviceId, updatedTokenData?.iat ?? 0)
    }

    async sendPasswordRecoveryEmail(email: string) {
        const user = await this.userQueryRepository.findByLoginOrEmail(email)
        //console.log(user, " user")
        if (!user) {
            return {
                status:ResultStatus.NotFound,
                data:errorMessagesHandleService({ message: 'User by this email not found', field: 'email' })
            }
        }
        user.emailConfirmation.passwordRecoveryCode = uuidv4();
        user.emailConfirmation.passwordRecoveryCodeExpirationDate =  add(new Date(), {hours: 1, minutes: 1});
        user.emailConfirmation.isPasswordRecoveryConfirmed = false;
        await user.save()
        try {
            const mailInfo=await emailService.sendPasswordRecoveryEmail(email,user.emailConfirmation.passwordRecoveryCode!)
            console.log('@> Information::mailInfo: ', mailInfo)
        }catch (error) {
            console.error('@> Error::emailManager: ', error)
            throw error
        }
        return {
            status:ResultStatus.Success,
            data:null
        }
    }
    async recoverUserPassword(newPassword:string, recoveryCode:string){
        const userToConfirm=await this.userQueryRepository.getUserByRecoveryCode(recoveryCode)
        if(!userToConfirm || userToConfirm.emailConfirmation.passwordRecoveryCode!==recoveryCode){
            return{
                status:ResultStatus.BadRequest,
                data:errorMessagesHandleService({ message: 'Incorrect verification code', field: 'recoveryCode' }),
            }
        }
        if(userToConfirm.emailConfirmation.isPasswordRecoveryConfirmed){
            return {
                status:ResultStatus.BadRequest,
                data:errorMessagesHandleService({ message: 'Registration was already confirmed', field: 'recoveryCode' }),
            }
        }
        if (userToConfirm.emailConfirmation.passwordRecoveryCodeExpirationDate && userToConfirm.emailConfirmation.passwordRecoveryCodeExpirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                data: errorMessagesHandleService({ message: 'Confirmation code expired', field: 'recoveryCode' }),
            }
        }
        const newPasswordHash=await bcryptService.generateHash(newPassword)
        const updateUser:IUserAccountDbModel={
            login:userToConfirm.login,
            email:userToConfirm.email,
            passwordHash:newPasswordHash,
            createdAt:userToConfirm.createdAt,
            emailConfirmation:{
                ...userToConfirm.emailConfirmation,
                isPasswordRecoveryConfirmed:true,
            }
        }
        await this.userCommandRepository.updateUserById(userToConfirm._id,updateUser)
        return {
            status:ResultStatus.Success,
            data:null
        }
    }
}
