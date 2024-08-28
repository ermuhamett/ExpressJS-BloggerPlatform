import {ICommentOutputModel, ILikeInfo} from "../types/comment-db-type";
import {commentMapper} from "../mapper/mapper";
import {QueryOutputType} from "../middleware/helper";
import {CommentsMongooseModel, LikesMongooseModel} from "../db/mongoose/models";
import {CommentDocument} from "../db/mongoose/schemas";
import {LikeStatuses} from "../types/like-db-type";
import {injectable} from "inversify";

@injectable()
export class CommentQueryRepository {
    async find(id: string) {
        return CommentsMongooseModel.findOne({_id: id});
    }

    async findForOutput(commentId: string, userId?: string): Promise<null | ICommentOutputModel> {
        try {
            const comment = await this.find(commentId);
            if (!comment) {
                return null
            }
            const likes: ILikeInfo = await this.getLikes(commentId, userId)
            return comment ? commentMapper(comment, likes) : null;
        } catch (e) {
            throw new Error('Failed to find comment for output');
        }
    }

    async getLikes(commentId: string, userId?: string) {
        try {
            let likeStatus = LikeStatuses.NONE;
            let userLike;
            // Если userId предоставлен, выполните запрос на поиск userLike
            if (userId) {
                userLike = await LikesMongooseModel.findOne({parentId: commentId, authorId: userId}).lean();
                if (userLike) {
                    likeStatus = userLike.status;
                }
            }
            const [likesCount, dislikesCount] = await Promise.all([
                LikesMongooseModel.countDocuments({parentId: commentId, status: LikeStatuses.LIKE}),
                LikesMongooseModel.countDocuments({parentId: commentId, status: LikeStatuses.DISLIKE})
            ]);
            return {
                likesCount,
                dislikesCount,
                myStatus: likeStatus
            };
        } catch (error) {
            console.error(`Error while getting likes for commentId ${commentId}: `, error);
            throw error;
        }
    }

    async getMany(query: QueryOutputType, postId?: string, userId?: string) {
        const byId = postId ? {postId: postId} : {}
        try {
            const totalCount = await CommentsMongooseModel.countDocuments(byId);
            const pageCount = Math.ceil(totalCount / query.pageSize)
            const comments: CommentDocument[] = await CommentsMongooseModel
                .find(byId)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
            // Создаем массив который содержит идентификаторы комментариев чтобы по нему найти лайки и сразу их склеить
            const commentsIds=comments.map(comment=>comment.id.toString())
            // Запрашивает информацию о лайках для каждого коммента параллельно, используя Promise.all.
            const extendedLikesInfos = await Promise.all(commentsIds.map(commentId => this.getLikes(commentId, userId)))
            // Создает массив объектов, содержащих посты и соответствующую информацию о лайках.
            const commentsWithLikeStatus = comments.map((comment, index) => ({
                comment,
                extendedLikesInfo: extendedLikesInfos[index]
            }))
            /*const itemsWithLikeStatus = [];
            for await (const comment of comments) {
                const commentId = comment._id.toString();
                const likes: ILikeInfo = await this.getLikes(commentId, userId)
                itemsWithLikeStatus.push({comment, likes});
            }*/
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: commentsWithLikeStatus.map(item => commentMapper(item.comment, item.extendedLikesInfo))
            }
        } catch (e) {
            console.log({get_comments_repo: e})
            return false
        }
    }
}