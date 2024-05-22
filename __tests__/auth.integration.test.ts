import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {agent} from "supertest";
import {SETTINGS} from "../src/main/settings";
import {createTestUserFromDb, createUserData} from "./mocks";
import {emailService} from "../src/common/adapters/email.service";
import {closeDb, connectToDb} from "../src/db/mongoose";
import {ResultStatus} from "../src/types/result.type";
import {authService, userCommandRepository, userQueryRepository} from "../src/main/composition-root";

describe('auth integration tests', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDb();
        //Очищаем базу
        await agent(app).delete(`${SETTINGS.PATH.DELETE}/all-data`).expect(204)
        //await userCollection.deleteMany({})
    })
    beforeEach(async()=>{
        jest.clearAllMocks();
    })
    afterAll(async () => {
        //Отключаемся от db после всех тестов
        await closeDb()
    })
    it('should register user with correct data', async () => {
        const {login, email, password} = createUserData()
        emailService.sendEmail = jest.fn().mockImplementation((email: string, confirmationCode: string) => {
            return 'Email send success'
        })
        const result = await authService.registerUser({login, email, password})
        console.log(result)
        // const result=await agent(app).post(`${SETTINGS.PATH.AUTH}/registration`)
        expect(result).not.toBeNull()
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    })
    it('should confirm user email success', async()=>{
        const user=createTestUserFromDb({})
        // Мокируем функции
        userQueryRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        userCommandRepository.updateConfirmation = jest.fn().mockResolvedValue(true); // Мок для функции обновления пользователя
        const result= await authService.confirmEmail(user.emailConfirmation.confirmationCode)
        console.log(result)
        // Проверяем, что функция findUserByConfirmationCode была вызвана один раз
        expect(userQueryRepository.findUserByConfirmationCode).toHaveBeenCalledTimes(1);
        // Проверяем, что функция updateConfirmation была вызвана один раз
        expect(userCommandRepository.updateConfirmation).toHaveBeenCalledTimes(1);
        // Проверяем результат
        expect(result).toBe(true); // Ожидаем успешное подтверждение
    })
    it('should return false in wrong confirmation code',async()=>{
        const user=createTestUserFromDb({})
        const wrongConfirmationCode='2131-3243453-123312356464';
        userQueryRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        const result = await authService.confirmEmail( wrongConfirmationCode)
        expect(userQueryRepository.findUserByConfirmationCode).toHaveBeenCalledTimes(1);
        expect(result).toBe(false)
    })
    it('try to confirm user is already confirmed', async()=>{
        const user=createTestUserFromDb({isConfirmed:true})
        userQueryRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        userCommandRepository.updateConfirmation = jest.fn().mockResolvedValue(true);
        const result= await authService.confirmEmail(user.emailConfirmation.confirmationCode)
        //console.log(result)
        // Проверяем результат
        expect(result).toBe(false); // Ожидаем успешное подтверждение
    })
    it('should success resend email registration',async()=>{
        // Создаем тестового пользователя
        const user = createTestUserFromDb({});
        // Мокируем функцию findByLoginOrEmail, чтобы она возвращала тестового пользователя
        userQueryRepository.findByLoginOrEmail = jest.fn().mockResolvedValue(user);
        // Мокируем функцию sendEmail, чтобы она всегда возвращала успешное выполнение
        emailService.sendEmail = jest.fn().mockImplementation((email: string, confirmationCode: string) => {
            return 'Email send success'
        })
        // Вызываем функцию, которую мы хотим протестировать
        const result = await authService.resendingEmail(user.email);
        // Проверяем, что функции были вызваны правильное количество раз
        expect(userQueryRepository.findByLoginOrEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
        // Проверяем результат функции
        expect(result).toBe(user); // Ожидаем, что функция вернет пользователя
    })
    describe('POST /auth/password-recovery',()=>{
        it('should return 204 even if current email is not registered (for prevent users email detection)',async ()=>{
            authService.sendPasswordRecoveryEmail=jest.fn().mockResolvedValue(true);
            const response = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/password-recovery`)
                .send({ email: 'nonexistent@example.com' });
            console.log(response.body)
            expect(response.status).toBe(204);
            expect(authService.sendPasswordRecoveryEmail).toHaveBeenCalledWith('nonexistent@example.com');
        })
        it('should return 204 if email is valid', async () => {
            authService.sendPasswordRecoveryEmail = jest.fn().mockResolvedValue(true);
            const response = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/password-recovery`)
                .send({ email: `mytestemail@gmail.com` });
            expect(response.status).toBe(204);
            expect(authService.sendPasswordRecoveryEmail).toHaveBeenCalledWith('mytestemail@gmail.com');
        });
        it('should return 400 if the inputModel has invalid email', async () => {
            const response = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/password-recovery`)
                .send({ email: 'invalid-email' });
            expect(response.status).toBe(400);
        });
    })
    describe('POST /auth/new-password', () => {
        it('should return 204 if new password is set successfully', async () => {
            const user = createTestUserFromDb({});
            const recoveryCode = 'valid-recovery-code';
            const newPassword = 'newPassword123!';

            authService.recoverUserPassword = jest.fn().mockResolvedValue({ status: ResultStatus.Success });

            const response = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/new-password`)
                .send({ newPassword, recoveryCode });
            console.log(response.body)
            expect(response.status).toBe(204);
            expect(authService.recoverUserPassword).toHaveBeenCalledWith(newPassword, recoveryCode);
        });

        it('should return 400 if the inputModel has invalid new password', async () => {
            const user = createTestUserFromDb({});
            const recoveryCode = 'valid-recovery-code';
            const newPassword = 'weak'; // Недостаточно сложный пароль

            authService.recoverUserPassword = jest.fn().mockResolvedValue({ status: ResultStatus.BadRequest, data: 'Invalid new password' });

            const response = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/new-password`)
                .send({ newPassword, recoveryCode });

            expect(response.status).toBe(400);
            expect(authService.recoverUserPassword).toHaveBeenCalledWith(newPassword, recoveryCode);
        });
    });
})