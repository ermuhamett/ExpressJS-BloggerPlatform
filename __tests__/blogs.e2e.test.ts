import {app} from "../src/main/app";
import {SETTINGS} from "../src/main/settings";
import {
    blogData,
    PaginationBlogView,
    PostDataConstructor,
    postDataForBlog,
    updatedBlogData
} from "./datasets";
import {blogCollection} from "../src/db/mongo-db";
import {addRoutes} from "../src/main/routes";
import {getAuthorizationHeader, IPostData, queryForBlog} from "./test-helpers";
import {closeDb, connectToDb} from "../src/db/mongoose";
import {BlogsMongooseModel} from "../src/db/mongoose/models";
const request = require("supertest");

const invalidBlogData = {...blogData};
let blogId: string;
let postId: string;
let post: IPostData;
let postNumber = 0;

describe('/blogs', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDb();
        //Очищаем коллекцию blog
        await BlogsMongooseModel.deleteMany({})
    });
    afterAll(async () => {
        await BlogsMongooseModel.deleteMany({})
        //Отключаемся от db после всех тестов
        await closeDb()
    })
    describe('Create blog and test validators for invalid data', () => {
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
            expect(hasNameError).toBe(true);
            //Громоздкий тест для того чтобы убедиться что мы получаем нужный нам валидатор
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

        it('should create a new blog', async () => {
            const res = await request(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getAuthorizationHeader())
                .send(blogData)
                .expect(400);
            console.log(res.body)
            expect(res.body).toHaveProperty('id');
            blogId = res.body.id;//Создаем новый блог и сохраняем его Id
        });
        //Создание поста через готовый датасет без blogId. blogId передается параметром который сливается в объект внутри запроса
        it('should create new post for specific blog with dataset', async () => {
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(postDataForBlog, blogId)
                .expect(201)
            console.log(res.body)
        })
        //Создаем новый пост по блогу передав нужный blogId
        it('should create new post for specific blog with class', async () => {
            postNumber++;
            post = new PostDataConstructor(blogId, postNumber)//Через класс создаем новый пост
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201)
            console.log(res.body)
        })
        //Создаем новый пост по блогу передав нужный blogId
        it('should return error if auth credentials is incorrect', async () => {
            postNumber++;
            post = new PostDataConstructor(blogId, postNumber)//Через класс создаем новый пост
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .send(post)
                .expect(401)
        })
        //Передаем несуществующий blogId для создание поста
        it('should return error if blogId is incorrect', async () => {
            const blogId = '65fdd2494fb437a6ea35ee8c';
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(404)
            console.log(res.body)
        })
    })

    describe('Get methods for blogs', () => {
        //Тест на получения по id
        it('should get the created blog', async () => {
            const response = await request(app)
                .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
                .expect(200);
            expect(response.body.id).toBe(blogId);//Проверяем создание этого блога то есть создалось ли оно
        });
        it('should return 401 when trying to access a specific blog without authorization', async () => {
            await request(app)
                .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
                .send(updatedBlogData)
                .expect(401);//Попытаемся обновить блог без авторизации
        });
    })

    describe('Update existing blog and test validators for update data', () => {
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

        it('try to update blog with incorrect name', async () => {
            const invalidName = {...updatedBlogData, name: ''};
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidName)
                .expect(400);
            console.log(res.body)
        });

        it('try to update blog with incorrect description', async () => {
            const invalidDescription = {...updatedBlogData, description: 'a'.repeat(501)};
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidDescription)
                .expect(400);
            console.log(res.body)
        });
        it('try to update blog with incorrect websiteUrl', async () => {
            const invalidWebsiteUrl = {...updatedBlogData, websiteUrl: "http://blabla"};
            const res = await request(app)
                .post(`${SETTINGS.PATH.BLOGS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(invalidWebsiteUrl)
                .expect(400);
            console.log(res.body)
        });
    })


    describe('Deleting a blog', () => {
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
    })

});
