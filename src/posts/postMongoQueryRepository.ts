import {ObjectId, WithId} from "mongodb";
import {postCollection, PostDbTypeMongo} from "../db/mongo-db";
import {QueryOutputType} from "../middleware/helper";
import {postMapper} from "../mapper/mapper";

export const postMongoQueryRepository = {
    async getMany(query: QueryOutputType, blogId?: string) {
        const byId = blogId ? {blogId: blogId} : {}
        const totalCount=await postCollection.countDocuments(byId)
        const pageCount=Math.ceil(totalCount/query.pageSize)
        //const filter={}
        try {
            const items:WithId<PostDbTypeMongo>[] =await postCollection
                .find(byId)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .toArray()
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(postMapper)
            }
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
}