import {SETTINGS} from "../main/settings";
import {Collection, Db, MongoClient, ObjectId, ServerApiVersion} from "mongodb";

export type BlogDbTypeMongo = {
    //_id:ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PostDbTypeMongo = {
    //_id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}

console.log(SETTINGS.MONGO_URL)
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Увеличение времени ожидания до 10 секунд
    /*connectTimeoutMS: 10000,
    socketTimeoutMS: 10000*/
})
export const db: Db = client.db(SETTINGS.DB_NAME);
export const blogCollection: Collection<BlogDbTypeMongo> = db.collection<BlogDbTypeMongo>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDbTypeMongo> = db.collection<PostDbTypeMongo>(SETTINGS.POST_COLLECTION_NAME)

export const connectToDB = async () => {
    try {
        await client.connect()
        // Send a ping to confirm a successful connection
        await client.db(SETTINGS.DB_NAME).command({ ping: 1 });
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