import {QueryOutputType} from "../middleware/helper";
import {blogCollection, BlogDbTypeMongo} from "../db/mongo-db";
import {WithId} from "mongodb";
import {blogMapper} from "../mapper/mapper";

export const blogMongoQueryRepository = {
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