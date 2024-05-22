import {QueryOutputType} from "../middleware/helper";
import {ObjectId} from "mongodb";
import {blogMapper} from "../mapper/mapper";
import {BlogOutputType} from "../types/blog-db-type";
import {BlogsMongooseModel} from "../db/mongoose/models";
import {BlogDocument} from "../db/mongoose/schemas";
import {injectable} from "inversify";

@injectable()
export class BlogQueryRepository{
    async find(id: ObjectId){
        return BlogsMongooseModel.findOne({_id:id})
    }
    async findForOutput(id: ObjectId): Promise<null | BlogOutputType> {
        try {
            const blog = await this.find(id);
            return blog ? blogMapper(blog) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    }
    async getMany(query:QueryOutputType, blogId?:string){
        const search = query.searchNameTerm ? {name: {$regex: query.searchNameTerm, $options: 'i'}} : {}
        const totalCount=await BlogsMongooseModel.countDocuments(search)
        const pageCount=Math.ceil(totalCount/query.pageSize)
        try {
            //TODO Через HydratedDocument можем получить id. Тоже самое что WithId но лучше создать тип в схемах
            const items: BlogDocument[] = await BlogsMongooseModel
                .find(search)
                .sort({[query.sortBy]:query.sortDirection})
                .skip((query.pageNumber-1)*query.pageSize)
                .limit(query.pageSize)
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