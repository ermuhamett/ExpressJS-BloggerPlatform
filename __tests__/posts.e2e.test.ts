import {app} from "../src/main/app";
import {SETTINGS} from "../src/main/settings";

const request = require("supertest");

const ADMIN_AUTH = 'admin:qwerty'
const getAuthorizationHeader = () => {
    const encodedCredentials = Buffer.from(ADMIN_AUTH).toString('base64');
    return `Basic ${encodedCredentials}`;
};
describe('/posts', () => {
    let blogId:string;
    let postId:string;

    beforeAll(async () => {
        await request(app).delete("/testing/all-data");

        const blogData = {
            name: 'Test Blog',
            description: 'Test Description',
            websiteUrl: 'https://testblog.com'
        };

        const blogResponse = await request(app)
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', getAuthorizationHeader())
            .send(blogData)
            .expect(201);

        blogId = blogResponse.body.id;

        const postData = {
            title: 'Test Post',
            shortDescription: 'Test Short Description',
            content: 'Test Content',
            blogId: blogId
        };

        const postResponse = await request(app)
            .post(SETTINGS.PATH.POSTS)
            .set('Authorization', getAuthorizationHeader())
            .send(postData)
            .expect(201);

        postId = postResponse.body.id;
    });
    describe('Creating a new post', () => {
        //Создание нового поста но оно уже создается в beforeAll, тут чисто проверка
        it('should create a new post', async () => {
            expect(postId).toBeDefined();
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
                title: '',
                shortDescription: 'Test Short Description',
                content: 'Test Content',
                blogId: blogId
            };
            console.log(invalidTitleData.blogId)
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
                title: 'Test Post',
                shortDescription: 'a'.repeat(201),
                content: 'Test Content',
                blogId: blogId
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
    //Удаляем блог
    it('should delete an existing blog', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', getAuthorizationHeader())
            .expect(204);
    });
    //Создание поста без блога
    describe('Creating a post without a blog', () => {
        it('should return 400 when trying to create a post without a blog', async () => {
            const postData = {
                title: 'Test Post',
                shortDescription: 'Test Short Description',
                content: 'Test Content',
                blogId:blogId
            };
            const res = await request(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getAuthorizationHeader())
                .send(postData)
                .expect(400);
            console.log(res.body)
            //expect(res.body.error).toBeDefined();
        });
    });
});

