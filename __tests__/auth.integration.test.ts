import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {closeDB, connectToDB, userCollection} from "../src/db/mongo-db";
import {agent} from "supertest";
import {SETTINGS} from "../src/main/settings";
import {createTestUserFromDb, createUserData} from "./mocks";
import {emailService} from "../src/common/adapters/email.service";
import {AuthService} from "../src/auth/auth-service";
import {userMongoRepository} from "../src/users/userMongoRepository";

describe('auth integration tests', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDB();
        //Очищаем базу
        await agent(app).delete(`${SETTINGS.PATH.DELETE}/all-data`).expect(204)
        await userCollection.deleteMany({})
    })
    beforeEach(async()=>{
        jest.clearAllMocks();
    })
    afterAll(async () => {
        //Отключаемся от db после всех тестов
        await closeDB()
    })
    it('should register user with correct data', async () => {
        const {login, email, password} = createUserData()
        emailService.sendEmail = jest.fn().mockImplementation((email: string, confirmationCode: string) => {
            return 'Email send success'
        })
        const result = await AuthService.registerUser({login, email, password})
        console.log(result)
        // const result=await agent(app).post(`${SETTINGS.PATH.AUTH}/registration`)
        expect(result).not.toBeNull()
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1)
    })
    it('should confirm user email success', async()=>{
        const user=createTestUserFromDb({})
        // Мокируем функции
        userMongoRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        userMongoRepository.updateConfirmation = jest.fn().mockResolvedValue(true); // Мок для функции обновления пользователя
        const result= await AuthService.confirmEmail(user.emailConfirmation.confirmationCode)
        console.log(result)
        // Проверяем, что функция findUserByConfirmationCode была вызвана один раз
        expect(userMongoRepository.findUserByConfirmationCode).toHaveBeenCalledTimes(1);
        // Проверяем, что функция updateConfirmation была вызвана один раз
        expect(userMongoRepository.updateConfirmation).toHaveBeenCalledTimes(1);
        // Проверяем результат
        expect(result).toBe(true); // Ожидаем успешное подтверждение
    })
    it('should return false in wrong confirmation code',async()=>{
        const user=createTestUserFromDb({})
        const wrongConfirmationCode='2131-3243453-123312356464';
        userMongoRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        const result = await AuthService.confirmEmail( wrongConfirmationCode)
        expect(userMongoRepository.findUserByConfirmationCode).toHaveBeenCalledTimes(1);
        expect(result).toBe(false)
    })
    it('try to confirm user is already confirmed', async()=>{
        const user=createTestUserFromDb({isConfirmed:true})
        userMongoRepository.findUserByConfirmationCode = jest.fn().mockImplementation((confirmationCode:string)=>{
            return user
        })
        userMongoRepository.updateConfirmation = jest.fn().mockResolvedValue(true);
        const result= await AuthService.confirmEmail(user.emailConfirmation.confirmationCode)
        console.log(result)
        // Проверяем результат
        expect(result).toBe(false); // Ожидаем успешное подтверждение
    })
    it('should success resend email registration',async()=>{
        // Создаем тестового пользователя
        const user = createTestUserFromDb({});
        // Мокируем функцию findByLoginOrEmail, чтобы она возвращала тестового пользователя
        userMongoRepository.findByLoginOrEmail = jest.fn().mockResolvedValue(user);
        // Мокируем функцию sendEmail, чтобы она всегда возвращала успешное выполнение
        emailService.sendEmail = jest.fn().mockImplementation((email: string, confirmationCode: string) => {
            return 'Email send success'
        })
        // Вызываем функцию, которую мы хотим протестировать
        const result = await AuthService.resendingEmail(user.email);
        // Проверяем, что функции были вызваны правильное количество раз
        expect(userMongoRepository.findByLoginOrEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
        // Проверяем результат функции
        expect(result).toBe(user); // Ожидаем, что функция вернет пользователя
    })
})