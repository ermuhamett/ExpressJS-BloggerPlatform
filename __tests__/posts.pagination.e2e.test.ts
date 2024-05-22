import {app} from "../src/main/app";
import {SETTINGS} from "../src/main/settings";
import {blogData, PaginationPostView, PostDataConstructor} from "./datasets";
import {addRoutes} from "../src/main/routes";
import {closeDB, connectToDB, postCollection} from "../src/db/mongo-db";
import {helper} from "../src/middleware/helper";
import {getAuthorizationHeader, IPostData, queryForPosts} from "./test-helpers";


const request = require("supertest");

let blogId: string;
export function generateMultiplePostData(blogId:string, count:number) {
    const posts:IPostData[] = [];
    for (let i = 1; i <= count; i++) {
        const post = new PostDataConstructor(blogId, i);
        posts.push(post);
    }
    return posts;
}
describe('/posts with pagination', ()=>{
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
    });
    // Функция для создания блога и постов для пагинации
     async function createBlogAndPostsForPagination() {
        // Создаем новый блог
        const res = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(blogData)
            .expect(201);

        // Проверяем, что блог успешно создан и получаем его Id
        expect(res.body).toHaveProperty('id');
        const blogId = res.body.id;

        // Генерируем 20 постов
        const createdPosts = generateMultiplePostData(blogId, 20);

        // Отправляем каждый пост через пост-запрос
        for (const post of createdPosts) {
            await request(app)
                .post(`${SETTINGS.PATH.POSTS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201);
        }

        // Возвращаем Id созданного блога
        return blogId;
    }
    describe('Create blog and posts for pagination', () => {
        //Создаем множество постов
        it('should create blog and posts', async () => {
            // Вызываем функцию для создания блога и постов
            blogId = await createBlogAndPostsForPagination();
        },20000);
    })
    describe('Get posts with pagination',()=>{
        //Тест на получения всех блогов через пагинацию
        it('should get the posts with pagination', async () => {
            const res = await request(app)
                .get(`${SETTINGS.PATH.POSTS}`)
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
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
        //Тест на получения всех блогов через пагинацию с query параметрами. Результат зависит от queryForPosts
        it('should get the first page of posts with pagination', async () => {
            // Вызываем хелпер для получения ожидаемых параметров запроса
            const queryParams = helper(queryForPosts);
            const res = await request(app)
                .get(`${SETTINGS.PATH.POSTS}`)
                .query(queryParams)
                .expect(200);
            // Создаем ожидаемый объект PaginationBlogView на основе полученного ответа
            const expectedPaginationData = new PaginationPostView(
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
    })
})