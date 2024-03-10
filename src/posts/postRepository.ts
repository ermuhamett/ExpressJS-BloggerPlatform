import {PostDbType, PostInputModel, PostOutputType} from "../db/post-db-type";
import {db} from "../db/db";
import {blogRepository} from "../blogs/blogRepository";

export const postRepository = {
    async create(input: PostInputModel): Promise<{ error?: string, id?: number }> {
        const blog = await blogRepository.find(+input.blogId)
        if (!blog) {
            console.log("123")
            return {error: 'Blog not found'};
        }
        const newPost: PostDbType = {
            id: Date.now() + Math.random(),
            title: input.title,
            shortDescription: input.shortDescription,
            content: input.content,
            blogId: input.blogId,
            blogName: blog.name
        }
        try {
            db.posts = [...db.posts, newPost]
        } catch (e) {
            console.log(e)
            return {error: 'e'}
        }
        return {id: newPost.id}
    },
    async getAll(): Promise<PostOutputType[]> {
        const posts=db.posts
        return posts.map(this.mapToOutput)
    },
    //TODO дописать метод update
    async updatePostById(id: number, updateData: Partial<PostInputModel>): Promise<PostOutputType | null> {
        const post = await this.find(id);
        if (!post) {
            return null; // Null если не найден пост по id
        }
        // Обновляем данные поста из переданных данных запроса
        const updatedPost = {
            ...post,
            ...updateData
        };
        // Обновляем post в базе данных
        db.posts = db.posts.map(p => p.id === id ? updatedPost : p);
        // Возвращаем обновленный пост
        return this.mapToOutput(updatedPost);
    },
    async deletePostById(id:number):Promise<boolean>{
        const postIndex=db.posts.findIndex(post=>post.id===id)
        if(postIndex===-1){
            return false; // Если пост с таким id не найден, возвращаем false
        }
        // Удаляем пост из массива по его индексу
        db.posts.splice(postIndex, 1);
        return true; // Возвращаем true, если пост успешно удален
    },
    async find(id: number): Promise<PostDbType> {
        return db.posts.find(p => p.id === id)
    },
    async findForOutput(id: number): Promise<null | PostOutputType> {
        const post = await this.find(id)
        if (!post) {
            return null
        }
        return this.mapToOutput(post)
    },
    mapToOutput(post: PostDbType): PostOutputType {
        return {
            id: post.id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName
        }
    }
}