import {ObjectId} from "mongodb";
import {QueryOutputType} from "../middleware/helper";
import {postMapper} from "../mapper/mapper";
import {PostOutputType} from "../types/post-db-type";
import {PostDocument} from "../db/mongoose/schemas";
import {PostsMongooseModel} from "../db/mongoose/models";

export class PostQueryRepository {
    async find(id: ObjectId) {
        return PostsMongooseModel.findOne({_id: id});
    }
    async findForOutput(id: ObjectId): Promise<null | PostOutputType> {
        try {
            const post = await this.find(id);
            return post ? postMapper(post) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    }
    async getMany(query: QueryOutputType, blogId?: string) {
        const byId = blogId ? {blogId: blogId} : {}
        const totalCount = await PostsMongooseModel.countDocuments(byId)
        const pageCount = Math.ceil(totalCount / query.pageSize)
        try {
            const items: PostDocument[] = await PostsMongooseModel
                .find(byId)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: items.map(postMapper)
            }
        } catch (e) {
            console.log({get_post_repo: e})
            return false
        }
    }
}
