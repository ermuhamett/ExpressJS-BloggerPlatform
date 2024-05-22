import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {closeDB, connectToDB, userCollection} from "../src/db/mongo-db";
import {UserDataInfo} from "./datasets";
import {SETTINGS} from "../src/main/settings";
import {getAuthorizationHeader} from "./test-helpers";
import {agent} from "supertest"
let userId: string
const userInfo = UserDataInfo.createFilledInstance("FPdRKtGvCD", "examplePassword", "example@email.com");
let accessToken: string; // Определение accessToken на уровне описания тестов
describe('/auth', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDB();
        //Очищаем коллекцию post
        await userCollection.deleteMany({})
    });
    afterAll(async () => {
        //Отключаемся от db после всех тестов
        await closeDB()
    })
    describe('should create new user status 201', () => {
        it('should create a new user', async () => {
            const res = await agent(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', getAuthorizationHeader())
                .send(userInfo)
                .expect(201);
            console.log(res.body);
        })
    })
    describe('POST requests for login endpoint', () => {
        it('should sign in user status 204', async () => {
            const loginOrEmail = userInfo.login || userInfo.email;
            const password = userInfo.password;
            const res = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send({loginOrEmail, password})
                .expect(200);
            accessToken = res.body.accessToken
            console.log(res.body.accessToken);
        })
        it('should return error if passed wrong login or password status 401', async () => {
            const loginOrEmail = 'wrongLogin';
            const password = userInfo.password;
            const res = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .set('Authorization', getAuthorizationHeader())
                .send({loginOrEmail, password})
                .expect(401);
            console.log(res.body);
        })
    })
    describe('GET requests for auth endpoint', () => {
        it('should return information about current user', async () => {
            const res = await agent(app)
                .get(`${SETTINGS.PATH.AUTH}/me`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
            console.log(res.body);
        })
        it('should return error if you dont send session', async () => {
            await agent(app)
                .get(`${SETTINGS.PATH.AUTH}/me`)
                .expect(401);
        })
    })
})