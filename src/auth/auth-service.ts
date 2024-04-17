import {ILoginInputModel} from "../types/auth-db-type";
import {userMongoRepository} from "../users/userMongoRepository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {jwtService} from "../common/adapters/jwt.service";
import {IUserInputModel} from "../types/user-db-type";
import {emailService} from "../common/adapters/email.service";
import {UserService} from "../users/user-service";
import {ObjectId} from "mongodb";
import {userMongoQueryRepository} from "../users/userMongoQueryRepository";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
export class AuthService {
    static async loginUser(input: ILoginInputModel) {
        const user = await userMongoRepository.findByLoginOrEmail(input.loginOrEmail)
        if (!user) return null;
        const isCorrectPassword = await bcryptService.checkPassword(input.password, user.passwordHash)
        if (!isCorrectPassword) return null;
        return await jwtService.createToken(user._id.toString())
    }
    static async registerUser(input: IUserInputModel) {
        try {
            // Создание пользователя
            const createResultId = await UserService.createUser(input);
            if (!createResultId) {
                console.error('Failed to create user');
                return null;
            }
            const createUser=await userMongoQueryRepository.find(new ObjectId(createResultId.id))
            if(!createUser){
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
        if(user.emailConfirmation.isConfirmed) return false;
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
}
