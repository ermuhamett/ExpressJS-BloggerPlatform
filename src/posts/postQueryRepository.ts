import {QueryOutputType} from "../middleware/helper";
import {newestLikesMapper, postMapper} from "../mapper/mapper";
import {IExtendedLikesInfo, IPostLikeModel, PostOutputType} from "../types/post-db-type";
import {PostDocument} from "../db/mongoose/schemas";
import {PostLikesMongooseModel, PostsMongooseModel} from "../db/mongoose/models";
import {injectable} from "inversify";
import {LikeStatuses} from "../types/like-db-type";

@injectable()
export class PostQueryRepository {
    async find(id: string) {
        return PostsMongooseModel.findOne({_id: id});
    }
    async findForOutput(postId: string, userId?: string): Promise<null | PostOutputType> {
        try {
            const post = await this.find(postId);
            if (!post) {
                return null
            }
            const likes: IExtendedLikesInfo = await this.getPostLikes(postId, userId)
            return post ? postMapper(post, likes) : null;
        } catch (e) {
            throw new Error('Failed to find post for output');
        }
    }

    async getPostLikes(postId: string, userId?: string) {
        try {
            let likeStatus = LikeStatuses.NONE;
            let userLike;
            // Если userId предоставлен, выполните запрос на поиск userLike
            if (userId) {
                userLike = await PostLikesMongooseModel.findOne({postId, likedUserId: userId}).lean();
                if (userLike) {
                    likeStatus = userLike.status;
                }
            }
            // Запрос для получения всех необходимых данных с использованием Promise.all
            const [likesCount, dislikesCount, newestLikes] = await Promise.all([
                PostLikesMongooseModel.countDocuments({postId, status: LikeStatuses.LIKE}),
                PostLikesMongooseModel.countDocuments({postId, status: LikeStatuses.DISLIKE}),
                PostLikesMongooseModel.find({postId, status: LikeStatuses.LIKE}).sort({addedAt: -1}).limit(3).lean()
            ]);
            return {
                likesCount,
                dislikesCount,
                myStatus: likeStatus,
                newestLikes: newestLikes.map(newestLikesMapper)
            };
        } catch (error) {
            console.error(`Error while getting likes for postId ${postId}: `, error);
            throw error;
        }
    }
    async getMany(query: QueryOutputType, blogId?: string, userId?: string) {
        const byId = blogId ? {blogId: blogId} : {}
        const totalCount = await PostsMongooseModel.countDocuments(byId)
        const pageCount = Math.ceil(totalCount / query.pageSize)
        try {
            const posts: PostDocument[] = await PostsMongooseModel
                .find(byId)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
            // Создает массив строковых идентификаторов постов.
            const postIds = posts.map(post => post.id.toString())
            // Запрашивает информацию о лайках для каждого поста параллельно, используя Promise.all.
            const extendedLikesInfos = await Promise.all(postIds.map(postId => this.getPostLikes(postId, userId)))
            // Создает массив объектов, содержащих посты и соответствующую информацию о лайках.
            const extendedLikesList = posts.map((post, index) => ({
                post,
                extendedLikesInfo: extendedLikesInfos[index]
            }))
            return {
                pagesCount: pageCount,
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: extendedLikesList.map(item => postMapper(item.post, item.extendedLikesInfo))
            }
        } catch (e) {
            console.log({get_post_repo: e})
            return false
        }
    }
}
