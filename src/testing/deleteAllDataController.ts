import {Request, Response} from "express";
import {
    AuthSessionMongooseModel,
    BlogsMongooseModel,
    CommentsMongooseModel, LikesMongooseModel, PostLikesMongooseModel,
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
    await LikesMongooseModel.deleteMany({})
    await PostLikesMongooseModel.deleteMany({})
    //await tokenCollection.deleteMany({})
    res.sendStatus(204);
    return
};
