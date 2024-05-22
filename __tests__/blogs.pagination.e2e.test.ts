import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {blogCollection, closeDB, connectToDB, postCollection} from "../src/db/mongo-db";
import {getAuthorizationHeader, IPostData, queryForBlog, queryForPosts} from "./test-helpers";
import {BlogInputModel} from "../src/types/blog-db-type";
import {blogData, PaginationBlogView, PaginationPostView} from "./datasets";
//import request from "supertest";
import {SETTINGS} from "../src/main/settings";
import {generateMultiplePostData} from "./posts.pagination.e2e.test";
//const request = require("supertest");
import {agent} from 'supertest';
import {helper} from "../src/middleware/helper";
import {closeDb, connectToDb} from "../src/db/mongoose";
import {BlogsMongooseModel, PostsMongooseModel} from "../src/db/mongoose/models";


let blogId: string;
function generateMultipleBlogs(count: number) {
    const blogs: BlogInputModel[] = [];
    for (let i = 1; i <= count; i++) {
        blogs.push(blogData);
    }
    return blogs;
}
describe('/blogs with pagination', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDb();
        //Очищаем коллекцию blog
        await blogCollection.deleteMany({})
        // Очищаем коллекцию постов
        await postCollection.deleteMany({});
    });
    afterAll(async () => {
        await BlogsMongooseModel.deleteMany({})
        await PostsMongooseModel.deleteMany({});
        //Отключаемся от db после всех тестов
        await closeDb()
    })
    async function createBlogsForPagination() {
        // Генерируем 20 блогов
        const createdBlogs = generateMultipleBlogs(10);
        // Отправляем каждый пост через пост-запрос
        for (const blog of createdBlogs) {
            const res=await agent(app)
                .post(`${SETTINGS.PATH.BLOGS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(blog)
                .expect(201);
        }
    }
    async function createBlogAndPostsForPagination() {
        // Создаем новый блог
        const res = await agent(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(blogData)
            .expect(201);
        // Проверяем, что блог успешно создан и получаем его Id
        expect(res.body).toHaveProperty('id');
        const blogId = res.body.id;
        // Генерируем 20 постов
        const createdPosts = generateMultiplePostData(blogId, 10);
        // Отправляем каждый пост через пост-запрос
        for (const post of createdPosts) {
            await agent(app)
                .post(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201);
        }
        // Возвращаем Id созданного блога
        return blogId;
    }

    describe('Create blogs and posts for pagination', () => {
        //Создаем множество блогов
        it('should create blogs for pagination ',async()=>{
            await createBlogsForPagination();
        }, 15000)
        //Создаем множество постов по блогу
        it('should create blog and posts', async () => {
            // Вызываем функцию для создания блога и постов
            blogId = await createBlogAndPostsForPagination();
        },15000);
    })
    describe('Get blogs and posts', ()=>{
        //Тест на получения всех блогов через пагинацию без query
        it('should get the blogs with pagination', async () => {
            const res = await agent(app)
                .get(`${SETTINGS.PATH.BLOGS}`)
                .expect(200);
            expect(res.body).toHaveProperty('pagesCount');
            expect(res.body).toHaveProperty('page');
            expect(res.body).toHaveProperty('pageSize');
            expect(res.body).toHaveProperty('totalCount');
            expect(res.body).toHaveProperty('items');
            console.log(res.body)
        })
        //Тест на получения всех блогов через пагинацию с сортировкой
        it('should get the blogs with pagination and sort queries', async () => {
            // Вызываем хелпер для получения ожидаемых параметров запроса
            const queryParams = helper(queryForBlog);
            const res = await agent(app)
                .get(`${SETTINGS.PATH.BLOGS}`)
                .query(queryParams) // Передаем параметры запроса через query()
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
            const expectedPaginationData = new PaginationBlogView(
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
        //Тест на получения всех постов для определенного блога через пагинацию с сортировкой
        it('should get posts for specified blog',async()=>{
            // Вызываем хелпер для получения ожидаемых параметров запроса
            const queryParams = helper(queryForPosts);
            const res = await agent(app)
                .get(`${SETTINGS.PATH.BLOGS}/${blogId}${SETTINGS.PATH.POSTS}`)
                .query(queryParams) // Передаем параметры запроса через query()
                .expect(200);
            // Создаем ожидаемый объект PaginationPostView на основе полученного ответа
            const expectedPaginationData = new PaginationPostView(
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
})