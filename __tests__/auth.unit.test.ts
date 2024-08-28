import {authService, userCommandRepository, userQueryRepository} from "../src/main/composition-root";
import {ResultStatus} from "../src/types/result.type";
import {emailService} from "../src/common/adapters/email.service";
import { v4 as uuidv4 } from 'uuid';
import {createTestUserFromDb, createTestUserWithMongoose} from "./mocks";
import {IUserAccountDbModel} from "../src/types/auth-db-type";
import {bcryptService} from "../src/common/adapters/bcrypt.service";
import {add} from "date-fns/add";
import mongoose from "mongoose";
import {sub} from "date-fns";

describe('Auth Service', ()=>{
    afterEach(()=>{
        jest.clearAllMocks();
    })
    describe('sendPasswordRecoveryEmail', () => {
        it('should return not found if user is not found', async () => {
            const email = 'test@example.com';
            const user = null; // Пользователь не найден
            userQueryRepository.findByLoginOrEmail = jest.fn().mockResolvedValueOnce(user);

            const result = await authService.sendPasswordRecoveryEmail(email);

            expect(result).toEqual({
                status: ResultStatus.NotFound,
                data: expect.any(Object),
            });
            expect(userQueryRepository.findByLoginOrEmail).toHaveBeenCalledWith(email);
        });

        it('should update user and send email if user is found', async () => {
            const email = 'test@example.com';
            // Создаем мок для объекта пользователя с методом save
            const user: IUserAccountDbModel & { save: jest.Mock } = {
                ...createTestUserFromDb({}),
                save: jest.fn().mockResolvedValue(createTestUserFromDb({})), // Здесь можно также указать ожидаемый результат от save
            };
            userQueryRepository.findByLoginOrEmail = jest.fn().mockResolvedValueOnce(user);
            emailService.sendPasswordRecoveryEmail = jest.fn().mockResolvedValueOnce({});

            const result = await authService.sendPasswordRecoveryEmail(email);
            expect(result).toEqual({
                status: ResultStatus.Success,
                data: null,
            });
            expect(userQueryRepository.findByLoginOrEmail).toHaveBeenCalledWith(email);
            expect(user.save).toHaveBeenCalled();
            expect(emailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(email, user.emailConfirmation.passwordRecoveryCode);
        });

        it('should handle error when sending email', async () => {
            console.error = jest.fn();
            const email = 'test';
            const user = createTestUserWithMongoose({}); // Создаем пользователя с помощью мока
            user.emailConfirmation.passwordRecoveryCode = uuidv4(); // Убедитесь, что код восстановления пароля установлен
            userQueryRepository.findByLoginOrEmail = jest.fn().mockResolvedValueOnce(user);

            emailService.sendPasswordRecoveryEmail = jest.fn().mockRejectedValueOnce(new Error('Email error'));

            await expect(authService.sendPasswordRecoveryEmail(email)).rejects.toThrowError('Email error');
            expect(console.error).toHaveBeenCalledWith('@> Error::emailManager: ', new Error('Email error'));
            expect(emailService.sendPasswordRecoveryEmail).toHaveBeenCalledWith(email, user.emailConfirmation.passwordRecoveryCode);
        });
    });
    describe('recoverUserPassword', () => {
        it('should recover user password successfully', async () => {
            const newPassword = 'newPassword123';
            const recoveryCode = 'validRecoveryCode';
            const userToConfirm = createTestUserWithMongoose({}); // Создаем пользователя с помощью мока
            userToConfirm.emailConfirmation.passwordRecoveryCode = recoveryCode;
            userToConfirm.emailConfirmation.passwordRecoveryCodeExpirationDate = add(new Date(), { hours: 1, minutes: 1 });
            userQueryRepository.getUserByRecoveryCode = jest.fn().mockResolvedValueOnce(userToConfirm);
            bcryptService.generateHash = jest.fn().mockResolvedValueOnce('hashedPassword');
            userCommandRepository.updateUserById = jest.fn().mockResolvedValueOnce(userToConfirm);

            const result = await authService.recoverUserPassword(newPassword, recoveryCode);

            expect(result).toEqual({
                status: ResultStatus.Success,
                data: null,
            });
        });

        it('should return BadRequest if recovery code is incorrect', async () => {
            const newPassword = 'newPassword123';
            const recoveryCode = 'invalidRecoveryCode';
            userQueryRepository.getUserByRecoveryCode = jest.fn().mockResolvedValueOnce(null);

            const result = await authService.recoverUserPassword(newPassword, recoveryCode);

            expect(result).toEqual({
                status: ResultStatus.BadRequest,
                data: expect.any(Object),
            });
            expect(userQueryRepository.getUserByRecoveryCode).toHaveBeenCalledWith(recoveryCode);
        });

        it('should return BadRequest if recovery code is expired', async () => {
            const newPassword = 'newPassword123';
            const recoveryCode = 'expiredRecoveryCode';
            const userToConfirm = createTestUserFromDb({});
            userToConfirm.emailConfirmation.passwordRecoveryCode = recoveryCode;
            userToConfirm.emailConfirmation.passwordRecoveryCodeExpirationDate = sub(new Date(), { hours: 1, minutes: 1 });
            userQueryRepository.getUserByRecoveryCode = jest.fn().mockResolvedValueOnce(userToConfirm);

            const result = await authService.recoverUserPassword(newPassword, recoveryCode);

            expect(result).toEqual({
                status: ResultStatus.BadRequest,
                data: expect.any(Object),
            });
        });

        it('should return BadRequest if user password recovery is already confirmed', async () => {
            const newPassword = 'newPassword123';
            const recoveryCode = 'validRecoveryCode';
            const userToConfirm = createTestUserFromDb({});
            userToConfirm.emailConfirmation.passwordRecoveryCode = recoveryCode;
            userToConfirm.emailConfirmation.isPasswordRecoveryConfirmed = true;
            userQueryRepository.getUserByRecoveryCode = jest.fn().mockResolvedValueOnce(userToConfirm);

            const result = await authService.recoverUserPassword(newPassword, recoveryCode);

            expect(result).toEqual({
                status: ResultStatus.BadRequest,
                data: expect.any(Object),
            });
        });
    });
})