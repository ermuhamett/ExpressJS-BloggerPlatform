import {app} from "../src/main/app";
import {SETTINGS} from "../src/main/settings";
import {blogData, updatedBlogData} from "./datasets";
import {blogCollection, closeDB, connectToDB, db} from "../src/db/mongo-db";
import {addRoutes} from "../src/main/routes";

const request = require("supertest");
const ADMIN_AUTH = 'admin:qwerty';
const getAuthorizationHeader = () => {
    const encodedCredentials = Buffer.from(ADMIN_AUTH).toString('base64');
    return `Basic ${encodedCredentials}`;
};
const invalidBlogData = {...blogData};
let blogId: string;

describe('/blogs', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDB();
        //Очищаем коллекцию blog
        await blogCollection.deleteMany({})
    });
    afterAll(async ()=>{
        //Отключаемся от db после всех тестов
        await closeDB()
    })
    it('should create a new blog', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(blogData)
            .expect(201);
        console.log(res.body)
        expect(res.body).toHaveProperty('id');
        blogId = res.body.id;//Создаем новый блог и сохраняем его Id
    });

    it('should get the created blog', async () => {
        const response = await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .expect(200);
        expect(response.body.id).toBe(blogId);//Проверяем создание этого блога то есть создалось ли оно
    });

    it('should return 401 when trying to access a specific blog without authorization', async () => {
        await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .send(updatedBlogData)
            .expect(401);//Попытаемся обновить блог без авторизации
    });
    it('should update an existing blog', async () => {
        const res = await request(app)
            .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .send(updatedBlogData)
            .expect(204);//Обновляем существующий блог
    });
    it('should retrieve the updated blog', async () => {
        const response = await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .expect(200);
        expect(response.body.name).toBe('Updated Blog');
        expect(response.body.description).toBe('Updated Description');
        expect(response.body.websiteUrl).toBe('https://updatedblog.com');
    });

    it('should delete an existing blog', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .expect(204);//Удаляем существующий блог
    });

    it('should return 404 when trying to retrieve a deleted blog', async () => {
        // Попытка получить удаленный блог
        await request(app)
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .expect(404);
    });

    it('should return 400 when sending invalid data while creating a blog', async () => {
        invalidBlogData.name = ''
        const res = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(invalidBlogData)
            .expect(400);//Создаем блог из неккорекктных данных
        const errorsMessages = res.body.errorsMessages;
        console.log(errorsMessages)
        expect(errorsMessages).toBeDefined(); // Проверяем, что массив сообщений об ошибках существует
        const hasNameError = errorsMessages.some((error: typeof errorsMessages) => error.field === 'name' && error.message === 'Name cannot be empty');
        expect(hasNameError).toBe(true);//Громоздкий тест для того чтобы убедиться что мы получаем нужный нам валидатор
        //console.log(hasNameError)
    });
    it('should return 400 when sending too long description while creating a blog', async () => {
        // Создаем описание длинее 500 символов
        invalidBlogData.description = 'a'.repeat(501)
        const res = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(invalidBlogData)
            .expect(400);//Отправляем длинное описание
        console.log(res.body)
    });
    it('should return 400 when sending a wrong websiteUrl', async () => {
        invalidBlogData.websiteUrl = 'websiteUrl';
        const res = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(invalidBlogData)
            .expect(400);//Неправильно указываем веб сайт, провалим валидацию на паттерн
        console.log(res.body)
    });
});
