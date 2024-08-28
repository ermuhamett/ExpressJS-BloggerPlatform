import {addRoutes} from "../src/main/routes";
import {app} from "../src/main/app";
import {closeDb, connectToDb} from "../src/db/mongoose";
import {BlogsMongooseModel, PostsMongooseModel} from "../src/db/mongoose/models";
import {agent} from "supertest";
import {SETTINGS} from "../src/main/settings";
import {getAuthorizationHeader, IPostData} from "./test-helpers";
import {blogData, likeStatusDislike, likeStatusLike, PostDataConstructor, UserDataInfo} from "./datasets";
import {appMiddleware} from "../src/middleware/appMiddleware";

const userInfo = UserDataInfo.createFilledInstance("FPdRKtGvCD", "examplePassword", "example@email.com");
let accessToken: string; // Определение accessToken на уровне описания тестов
let blogId:string;
let postId:string
let postNumber:number=0;
let post:IPostData;

///Самый правильный тест и работающий на данный момент
describe('/posts likes', ()=>{
    beforeAll(async()=>{
        appMiddleware(app);//Сначала он потом middleware так как парсер не подключается
        addRoutes(app);
        await connectToDb();
        await agent(app).delete(`${SETTINGS.PATH.DELETE}/all-data`).expect(204)
    })
    afterAll(async()=>{
        //Отключаемся от db после всех тестов
        await closeDb()
    })
    describe('User operation(create, login)', ()=>{
        it('should create new user', async()=>{
            const res = await agent(app)
                .post(`${SETTINGS.PATH.USERS}`)
                .set('Authorization', getAuthorizationHeader())
                .send(userInfo)
                .expect(201);
            console.log(res.body);
        })
        it('should login new user', async()=>{
            const loginOrEmail = userInfo.login;
            const password = userInfo.password;
            const res = await agent(app)
                .post(`${SETTINGS.PATH.AUTH}/login`)
                .send({loginOrEmail, password})
                .expect(200);
            accessToken = res.body.accessToken
            console.log(res.body.accessToken);
        })
    })
    describe('Create blog and post',()=>{
        it('should create new blog',async()=>{
            const res = await agent(app)
                .post(SETTINGS.PATH.BLOGS)
                .set('Authorization', getAuthorizationHeader())
                .send(blogData)
                .expect(201);
            //expect(res.body).toHaveProperty('id');
            blogId = res.body.id;//Создаем новый блог и сохраняем его Id
            postNumber++;
            post = new PostDataConstructor(blogId, postNumber)//Через класс создаем новый пост
        })
        it('should create new post by blog',async()=>{
            const res=await agent(app)
                .post(SETTINGS.PATH.POSTS)
                .set('Authorization', getAuthorizationHeader())
                .send(post)
                .expect(201)
            console.log(res.body)
            postId=res.body.id
        })
    })
    describe('Like for the post', ()=>{
        it('should like the post', async()=>{
            await agent(app)
                .put(`${SETTINGS.PATH.POSTS}/${postId}/like-status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(likeStatusLike)
                .expect(204)
        })
        it('should dislike the post', async ()=>{
            await agent(app)
                .put(`${SETTINGS.PATH.POSTS}/${postId}/like-status`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send(likeStatusDislike)
                .expect(204)
        });
    })
    describe('Get posts after like/dislike operation', ()=>{
        it('should return post by id with new like statuses', async()=>{
            const res=await agent(app)
                .get(`${SETTINGS.PATH.POSTS}/${postId}`)
                .expect(200)
            console.log(res.body)
        })
        it('should return posts with pagination statuses', async()=>{
            const res=await agent(app)
                .get(`${SETTINGS.PATH.POSTS}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
            console.log(res.body)
        })
    })
})