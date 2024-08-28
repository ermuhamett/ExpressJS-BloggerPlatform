import {ObjectId} from "mongodb";
//import {postCollection} from "../db/mongo-db";
import {IPostLikeModel, PostDbTypeMongo, PostInputModel, PostOutputType} from "../types/post-db-type";
import {postMapper} from "../mapper/mapper";
import {PostLikesMongooseModel, PostsMongooseModel} from "../db/mongoose/models";
import {injectable} from "inversify";
import {ResultStatus} from "../types/result.type";

@injectable()
export class PostCommandRepository {
    async create(postData: PostDbTypeMongo): Promise<{ error?: string, id?: ObjectId }> {
        try {
            const insertedInfo = await PostsMongooseModel.create(postData)
            return {id: insertedInfo._id};
        } catch (error) {
            return {error: 'Error in postCommandRepository'}
        }
    }

    async updatePostById(id: ObjectId, updateData: Partial<PostInputModel>): Promise<Boolean | null> {
        try {
            const updatedPost = await PostsMongooseModel.updateOne({_id:id}, updateData)
            return updatedPost.modifiedCount === 1;
        } catch (error) {
            console.error('Failed to update post:', error);
            throw new Error('Failed to update post');
        }
    }

    async updatePostLike(updateModel: IPostLikeModel) {
        const like = await PostLikesMongooseModel.findOneAndUpdate({$and: [{likedUserLogin: updateModel.likedUserLogin}, {postId: updateModel.postId}]}, updateModel)
        if(!like){
            await PostLikesMongooseModel.create(updateModel)
        }
        return{
            status:ResultStatus.Success,
            data:null
        }
    }

    async deletePostById(id: ObjectId): Promise<boolean> {
        try {
            const result = await PostsMongooseModel.deleteOne({_id: id});
            return result.deletedCount === 1;
        } catch (error) {
            console.error('Failed to delete post:', error);
            throw new Error('Failed to delete post');
        }
    }
}