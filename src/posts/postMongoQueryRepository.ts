import {ObjectId, WithId} from "mongodb";
import {postCollection} from "../db/mongo-db";
import {QueryOutputType} from "../middleware/helper";
import {postMapper} from "../mapper/mapper";
import {PostDbTypeMongo, PostOutputType} from "../types/post-db-type";
export const postMongoQueryRepository = {
    async find(id: ObjectId){
        return await postCollection.findOne({_id:id})
    },
    async findForOutput(id: ObjectId): Promise<null | PostOutputType> {
        try {
            const post = await this.find(id);
            return post ? postMapper(post) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
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
            console.log({get_post_repo: e})
            return false
        }
    }
}