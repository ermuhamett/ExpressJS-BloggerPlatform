import {Request, Response} from "express";
import {
    authSessionCollection,
    blogCollection,
    commentCollection,
    postCollection, rateLimitCollection,
    userCollection
} from "../db/mongo-db";
import {
    AuthSessionMongooseModel,
    BlogsMongooseModel,
    CommentsMongooseModel,
    PostsMongooseModel,
    RateLimitMongooseModel,
    UsersMongooseModel
} from "../db/mongoose/models";

export const deleteAllDataController = async (req: Request, res: Response) => {
    //await db.dropDatabase()
    await BlogsMongooseModel.deleteMany({})
    await PostsMongooseModel.deleteMany({})
    await UsersMongooseModel.deleteMany({})
    await CommentsMongooseModel.deleteMany({})
    await AuthSessionMongooseModel.deleteMany({})
    await RateLimitMongooseModel.deleteMany({})
    //await tokenCollection.deleteMany({})
    res.sendStatus(204);
    return
};
