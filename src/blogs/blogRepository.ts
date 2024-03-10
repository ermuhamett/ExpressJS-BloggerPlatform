import {BlogDbType, BlogInputModel, BlogOutputType} from "../db/blog-db-type";
import {db} from "../db/db";
import {PostInputModel, PostOutputType} from "../db/post-db-type";

export const blogRepository={
    async create(input:BlogInputModel):Promise<{ error?: string, id?: number }>{
        const newBlog:BlogDbType={
            id: Date.now() + Math.random(),
            name:input.name,
            description:input.description,
            websiteUrl:input.websiteUrl
        }
        try {
            db.blogs = [...db.blogs, newBlog]
        } catch (e) {
            return {error: 'e'}
        }
        return {id: newBlog.id}
    },
    async getAll():Promise<BlogOutputType[]>{
        const blogs= db.blogs
        return blogs.map(this.mapToOutput)
    },
    async updateBlogById(id: number, updateData: Partial<BlogInputModel>): Promise<BlogOutputType | null> {
        const blog = await this.find(id);
        if (!blog) {
            return null; // Null если не найден пост по id
        }
        const updatedBlog = {
            ...blog,
            ...updateData
        };
        db.blogs = db.blogs.map(p => p.id === id ? updatedBlog : p);
        return this.mapToOutput(updatedBlog);
    },
    async deleteBlogById(id:number):Promise<boolean>{
        const blogIndex=db.blogs.findIndex(blog=>blog.id===id)
        if(blogIndex===-1){
            return false;
        }
        db.blogs.splice(blogIndex, 1);
        return true;
    },
    async find(id: number): Promise<BlogDbType> {
        return db.blogs.find(b => b.id == id)
    },
    async findForOutput(id: number): Promise<null | BlogOutputType> {
        const blog = await this.find(id)
        if (!blog) {
            return null
        }
        return this.mapToOutput(blog)
    },
    mapToOutput(blog: BlogDbType): BlogOutputType {
        return {
            id: blog.id.toString(),
            name:blog.name,
            description:blog.description,
            websiteUrl:blog.websiteUrl
        }
    }
}