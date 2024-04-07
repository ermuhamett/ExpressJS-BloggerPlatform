import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {helper, QueryOutputType} from "../../middleware/helper";
import {postMongoQueryRepository} from "../../posts/postMongoQueryRepository";
import {blogMongoQueryRepository} from "../blogMongoQueryRepository";

export const getPostsByBlogController = async(req: Request, res: Response) => {
    const blogId = req.params.blogId;
    const blog = await blogMongoQueryRepository.find(new ObjectId(blogId))
    if (!blog) {
        return res.status(404).send('Blog not exist')
    } else {
        const sanitizedQuery: QueryOutputType = helper(req.query)
        const answer = await postMongoQueryRepository.getMany(sanitizedQuery, blogId);
        if (!answer) {
            return res.sendStatus(500)
        }
        return res.status(200).send(answer)
    }
}