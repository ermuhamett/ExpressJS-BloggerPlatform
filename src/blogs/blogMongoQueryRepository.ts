import {QueryOutputType} from "../middleware/helper";
import {blogCollection} from "../db/mongo-db";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "../mapper/mapper";
import {BlogDbTypeMongo, BlogOutputType} from "../types/blog-db-type";

export const blogMongoQueryRepository = {
    async find(id: ObjectId){
        return await blogCollection.findOne({_id:id})
    },
    async findForOutput(id: ObjectId): Promise<null | BlogOutputType> {
        try {
            const blog = await this.find(id);
            return blog ? blogMapper(blog) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
    async getMany(query:QueryOutputType, blogId?:string){
        const search = query.searchNameTerm ? {name: {$regex: query.searchNameTerm, $options: 'i'}} : {}
        const totalCount=await blogCollection.countDocuments(search)
        const pageCount=Math.ceil(totalCount/query.pageSize)
        try {
            const items:WithId<BlogDbTypeMongo>[] =await blogCollection
                .find(search)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
                .toArray()
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(blogMapper)
            }
        }
        catch (e) {
            console.log(e)
            return false
        }
    }
}