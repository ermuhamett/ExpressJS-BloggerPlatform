import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {closeDB, connectToDB, userCollection} from "../src/db/mongo-db";
import {PaginationUserView, UserDataInfo} from "./datasets";
import {SETTINGS} from "../src/main/settings";
import {getAuthorizationHeader, queryForPosts, queryForUsers} from "./test-helpers";
import {helper} from "../src/middleware/helper";
import {closeDb, connectToDb} from "../src/db/mongoose";
import {UsersMongooseModel} from "../src/db/mongoose/models";

const request = require("supertest");
let userId: string
const userInfo = UserDataInfo.createFilledInstance("FPdRKtGvCD", "examplePassword", "example@email.com");
describe('/users', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDb();
        //Очищаем коллекцию post
        await UsersMongooseModel.deleteMany({})
    });
    afterAll(async () => {
        //Отключаемся от db после всех тестов
        await closeDb()
    })
    describe('Create new user to system', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', getAuthorizationHeader())
                .send(userInfo)
                .expect(201);
            console.log(res.body);
            userId = res.body.id
        })
        it('should return 400 when sending incorrect login', async () => {
            const invalidLogin = {...userInfo, login: 'a'.repeat(11),}
            const res = await request(app)
                .post(`${SETTINGS.PATH.USERS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidLogin)
                .expect(400);
            console.log(res.body)
        })
        it('should return 400 when sending incorrect password', async () => {
            const invalidPassword = {...userInfo, password: 'a'.repeat(21),}
            const res = await request(app)
                .post(`${SETTINGS.PATH.USERS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidPassword)
                .expect(400);
            console.log(res.body)
        })
        it('should return 400 when sending incorrect email', async () => {
            const invalidEmail = {...userInfo, email: 'email.email',}
            const res = await request(app)
                .post(`${SETTINGS.PATH.USERS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidEmail)
                .expect(400);
            console.log(res.body)
        })
    })
    describe('Get methods for users', ()=>{
       //Получаем список всех пользователей через пагинацию
        it('should get the users with pagination', async () => {
            const res = await request(app)
                .get(`${SETTINGS.PATH.POSTS}`)
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
            const expectedPaginationData = new PaginationUserView(
                res.body.pagesCount,
                res.body.page,
                res.body.pageSize,
                res.body.totalCount,
                res.body.items
            );
            // Проверяем, что полученный ответ соответствует ожидаемой структуре
            expect(res.body).toEqual(expectedPaginationData);
            console.log(res.body)
        })
        //Тест на получения всех блогов через пагинацию с query параметрами
        it('should get the users with pagination and queries', async () => {
            // Вызываем хелпер для получения ожидаемых параметров запроса
            const queryParams = helper(queryForUsers);
            const res = await request(app)
                .get(`${SETTINGS.PATH.USERS}`)
                .set('Authorization', getAuthorizationHeader())
                .query(queryParams)
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
            const expectedPaginationData = new PaginationUserView(
                res.body.pagesCount,
                res.body.page,
                res.body.pageSize,
                res.body.totalCount,
                res.body.items
            );
            // Проверяем, что полученный ответ соответствует ожидаемой структуре
            expect(res.body).toEqual(expectedPaginationData);
            console.log(res.body)
        })
    })
    describe('Delete methods for users',()=>{
        //Проверка на авторизацию по эндпоинту
        it('should delete an existing post', async () => {
            await request(app)
                .delete(`${SETTINGS.PATH.USERS}/${userId}`)
                .expect(401);
        });
        //Удаляем существующий пост
        it('should delete an existing post', async () => {
            await request(app)
                .delete(`${SETTINGS.PATH.USERS}/${userId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(204);
        });
        //Возвращаем 404 при повторном удалении
        it('should return 404 when trying to retrieve a deleted post', async () => {
            await request(app)
                .get(`${SETTINGS.PATH.USERS}/${userId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(404);
        });
    })
})