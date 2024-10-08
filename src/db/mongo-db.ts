import {SETTINGS} from "../main/settings";
import {Collection, Db, MongoClient, ServerApiVersion} from "mongodb";
import {BlogDbTypeMongo} from "../types/blog-db-type";
import {PostDbTypeMongo} from "../types/post-db-type";
import {ICommentDbMongo} from "../types/comment-db-type";
import {IRateLimitModel, ISessionInfo, IUserAccountDbModel} from "../types/auth-db-type";

console.log(SETTINGS.LOCAL_MONGO_URL)
const client: MongoClient = new MongoClient(SETTINGS.LOCAL_MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})
export const db: Db = client.db(SETTINGS.DB_NAME);
export const blogCollection: Collection<BlogDbTypeMongo> = db.collection<BlogDbTypeMongo>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDbTypeMongo> = db.collection<PostDbTypeMongo>(SETTINGS.POST_COLLECTION_NAME)
export const userCollection: Collection<IUserAccountDbModel> = db.collection<IUserAccountDbModel>(SETTINGS.USER_COLLECTION_NAME)
export const commentCollection: Collection<ICommentDbMongo> = db.collection<ICommentDbMongo>(SETTINGS.COMMENT_COLLECTION_NAME)
export const authSessionCollection: Collection<ISessionInfo> = db.collection<ISessionInfo>(SETTINGS.SESSION_COLLECTION_NAME)
export const rateLimitCollection:Collection<IRateLimitModel> = db.collection<IRateLimitModel>(SETTINGS.LIMIT_COLLECTION_NAME)
export const connectToDB = async () => {
    try {
        await client.connect()
        // Send a ping to confirm a successful connection
        await client.db(SETTINGS.DB_NAME).command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}

export const closeDB = async () => {
    await client.close();
}