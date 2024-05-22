import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {closeDB, connectToDB} from "../src/db/mongo-db";
import {agent} from "supertest";
import {SETTINGS} from "../src/main/settings";
import {getAuthorizationHeader, IPostData, queryForComments} from "./test-helpers";
import {blogData, contentData, PaginationCommentView, PostDataConstructor, UserDataInfo} from "./datasets";
import {ICommentInputModel} from "../src/types/comment-db-type";
import {helper} from "../src/middleware/helper";

//Переменные для постов и блогов
let blogId: string;
let postId: string;
let post: IPostData;
let postNumber = 0;
//Переменные для пользователя
let userId: string
const userInfo = UserDataInfo.createFilledInstance("FPdRKtGvCD", "examplePassword", "example@email.com");
let accessToken: string; // Определение accessToken на уровне описания тестов
//
let commentId: string;

export function generateMultipleCommentData(count: number) {
    const comments: ICommentInputModel[] = [];
    for (let i = 1; i <= count; i++) {
        comments.push(contentData);
    }
    return comments;
}

describe('/comments', () => {
    beforeAll(async () => {
        //Подключаем роуты
        addRoutes(app)
        // Подключаемся к db
        await connectToDB();
        await agent(app)
            .delete(`${SETTINGS.PATH.DELETE}/all-data`)
            .expect(204)
    });
    afterAll(async () => {
        await agent(app)
            .delete(`${SETTINGS.PATH.DELETE}/all-data`)
            .expect(204)
        //Отключаемся от db после всех тестов
        await closeDB()
    })
    describe('Create user for comments and take session', () => {
        it('should create a new user', async () => {
            const res = await agent(app)
                .post(SETTINGS.PATH.USERS)
                .set('Authorization', getAuthorizationHeader())
                .send(userInfo)
                .expect(201);
            console.log(res.body);
        })
        it('should sign in user', async () => {
            const loginOrEmail = userInfo.login || userInfo.email;
            const password = userInfo.password;
            const res = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send({loginOrEmail, password})
                .expect(200);
            accessToken = res.body.accessToken
        })
    })
    describe('Create blog and post', () => {
        //Создаем новый блог
        it('create a new blog', async () => {
            const res = await agent(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getAuthorizationHeader())
                .send(blogData)
                .expect(201);
            expect(res.body).toHaveProperty('id');
            blogId = res.body.id;//Создаем новый блог и сохраняем его Id
            postNumber++;
            post = new PostDataConstructor(blogId, postNumber)//Через класс создаем новый пост
        });
        //Создание нового поста
        it('should create a new post', async () => {
            const res = await agent(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201);
            console.log(res.body)
            postId = res.body.id;
            console.log(postId)
        });
    })
    describe('POST requests for comments', () => {
        it('should create new comment', async () => {
            const res = await agent(app)
                .post(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(201);
            console.log(res.body)
            commentId = res.body.id;
        })
        it('should return return if input model incorrect values', async () => {
            const invalidContent = contentData.content.repeat(301)
            const res = await agent(app)
                .post(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(invalidContent)
                .expect(400);
            console.log(res.body)
        })
        it('should return error if we dont send access session', async () => {
            await agent(app)
                .post(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`)
                .send(contentData)
                .expect(401);
        })
        it('should return error if specified postId doesnt exists', async () => {
            const res = await agent(app)
                .post(`${SETTINGS.PATH.POSTS}/6612a76b477e66eb0b68d1d8${SETTINGS.PATH.COMMENTS}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(404);
            console.log(res.body)
        })
        it('should create multiple comments for post', async () => {
            const createdComments = generateMultipleCommentData(10);
            for (const comment of createdComments) {
                await agent(app)
                    .post(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .send(comment)
                    .expect(201);
            }
        }, 8000)
    })

    describe('GET requests for comments', () => {
        it('should return comments for specified post', async () => {
            // Вызываем хелпер для получения ожидаемых параметров запроса
            const queryParams = helper(queryForComments);
            const res = await agent(app)
                .get(`${SETTINGS.PATH.POSTS}/${postId}${SETTINGS.PATH.COMMENTS}`)
                .query(queryParams)
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
            const expectedPaginationData = new PaginationCommentView(
                res.body.pagesCount,
                res.body.page,
                res.body.pageSize,
                res.body.totalCount,
                res.body.items
            );
            // Проверяем, что полученный ответ соответствует ожидаемой структуре
            expect(res.body).toEqual(expectedPaginationData);
            // Проверка, что количество постов на второй странице также равно 10
            expect(res.body.items.length).toBe(5);
            console.log(res.body)
        })
        it('should return comment by id', async () => {
            const res = await agent(app)
                .get(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .expect(200)
            console.log(res.body)
        })
    })
    describe('PUT requests for comments', () => {
        it('should update existing comment by id', async () => {
            await agent(app)
                .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(204)
        })
        it('should return error update existing comment by id', async () => {
            const invalidContent = contentData.content.repeat(301)
            const res = await agent(app)
                .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(invalidContent)
                .expect(400)
            console.log(res.body)
        })
        it('should return error if comment not found', async () => {
            await agent(app)
                .put(`${SETTINGS.PATH.COMMENTS}/6612a76b477e66eb0b68d1d8`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(404)
        })
    })
    describe('DELETE requests for comments', () => {
        it('should return error if not set session', async () => {
            await agent(app)
                .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .send(contentData)
                .expect(401)
        })
        it('should delete existing comment by id', async () => {
            await agent(app)
                .delete(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(204)

        })
        it('should return error if comment not found', async () => {
            await agent(app)
                .put(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(contentData)
                .expect(404)
        })
    })
})