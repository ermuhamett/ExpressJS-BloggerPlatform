import {ObjectId, WithId} from "mongodb";
import {ICommentDbMongo, ICommentOutputModel} from "../types/comment-db-type";
import {commentMapper} from "../mapper/mapper";
import {commentCollection} from "../db/mongo-db";
import {QueryOutputType} from "../middleware/helper";
export const commentQueryMongoRepository = {
    async find(id: ObjectId) {
        return await commentCollection.findOne({_id: id})
    },
    async findForOutput(id: ObjectId): Promise<null | ICommentOutputModel> {
        try {
            const comment = await this.find(id);
            return comment ? commentMapper(comment) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    },
    async getMany(query: QueryOutputType, postId?: string){
        const byId = postId ? {postId: postId} : {}
        try {
            let totalCount;
            if (postId) {
                totalCount = await commentCollection.countDocuments(byId);
            } else {
                totalCount = await commentCollection.countDocuments();
            }
            //const totalCount=await commentCollection.countDocuments(byId)
            const pageCount=Math.ceil(totalCount/query.pageSize)
            const items:WithId<ICommentDbMongo>[] =await commentCollection
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
                items: items.map(commentMapper)
            }
        }
        catch (e) {
            console.log({get_comments_repo: e})
            return false
        }
    }
}