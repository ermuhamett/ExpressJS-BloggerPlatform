import {app} from "../src/main/app";
import {SETTINGS} from "../src/main/settings";
import {blogData, IPostData, PostDataConstructor} from "./datasets";
import {addRoutes} from "../src/main/routes";
import {blogCollection, closeDB, connectToDB, postCollection} from "../src/db/mongo-db";

const request = require("supertest");

const ADMIN_AUTH = 'admin:qwerty'
const getAuthorizationHeader = () => {
    const encodedCredentials = Buffer.from(ADMIN_AUTH).toString('base64');
    return `Basic ${encodedCredentials}`;
};
let blogId: string;
let postId: string;
let post: IPostData;
let postNumber = 0;
describe('/posts', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDB();
        //Очищаем коллекцию post
        await postCollection.deleteMany({})
    });
    afterAll(async () => {
        //Отключаемся от db после всех тестов
        await closeDB()
    }, 1000)
    describe('Create blog', () => {
        //Создаем новый блог
        it('create a new blog', async () => {
            const res = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getAuthorizationHeader())
                .send(blogData)
                .expect(201);
            expect(res.body).toHaveProperty('id');
            blogId = res.body.id;//Создаем новый блог и сохраняем его Id
            postNumber++;
            post = new PostDataConstructor(blogId, postNumber)//Через класс создаем новый пост
        });
    })
    describe('Creating a new post', () => {
        //Создание нового поста
        it('should create a new post', async () => {
            const res = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201);
            console.log(res.body)
            postId = res.body.id;
        });
        //Убедимся что пост создалось через проверка по id
        it('should retrieve the created post', async () => {
            const response = await request(app)
                .get(`${SETTINGS.PATH.POSTS}/${postId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(200);
            expect(response.body.id).toBe(postId);
        });
        //Валидация на название поста
        it('should return 400 when sending invalid data while creating post', async () => {
            const invalidTitleData = {
                ...post,
                title: '',
            };
            const res = await request(app)
                .post(`${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidTitleData)
                .expect(400);
            console.log(res.body)
            // expect(res.body.error).toBeDefined();
        });
        //Проверка валидации 400 если слишком длинное описание
        it('should return 400 when sending long short description', async () => {
            const longDescriptionData = {
                ...post,
                shortDescription: 'a'.repeat(201),
            };
            const res = await request(app)
                .post(`${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(longDescriptionData)
                .expect(400);
            console.log(res.body)
        });
    });
    describe('Updating an existing post', () => {
        //Обновляем существующий пост
        it('should update an existing post', async () => {
            const updatedData = {
                title: 'Updated Post',
                shortDescription: 'Updated Short Description',
                content: 'Updated Content',
                blogId: blogId
            };
            await request(app)
                .put(`${SETTINGS.PATH.POSTS}/${postId}`)
                .set('Authorization', getAuthorizationHeader())
                .send(updatedData)
                .expect(204);
        });
        //Возвращаем существующий пост и проверям обновилось ли оно
        it('should retrieve the updated post', async () => {
            const response = await request(app)
                .get(`${SETTINGS.PATH.POSTS}/${postId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(200);
            expect(response.body.title).toBe('Updated Post');
            expect(response.body.shortDescription).toBe('Updated Short Description');
            expect(response.body.content).toBe('Updated Content');
        });
    });

    describe('Deleting a post', () => {
        //Удаляем существующий пост
        it('should delete an existing post', async () => {
            await request(app)
                .delete(`${SETTINGS.PATH.POSTS}/${postId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(204);
        });
        //Возвращаем 404 при повторном удалении
        it('should return 404 when trying to retrieve a deleted post', async () => {
            await request(app)
                .get(`${SETTINGS.PATH.POSTS}/${postId}`)
                .set('Authorization', getAuthorizationHeader())
                .expect(404);
        });
    });

    //Создание поста без блога
    describe('Creating a post without a blog', () => {
        const post_without_blogID = new PostDataConstructor('123', 1)
        it('should return 400 when trying to create a post without a blog', async () => {
            const res = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getAuthorizationHeader())
                .send(post_without_blogID)
                .expect(400);
            console.log(res.body)
        });
    });
});

