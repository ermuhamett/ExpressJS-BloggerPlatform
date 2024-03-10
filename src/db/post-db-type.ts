export type PostInputModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: number
}

export type PostOutputType={
    id:string,
    title:string,
    shortDescription:string,
    content:string,
    blogId:string,
    blogName:string,
}


export type PostDbType={
    id:number,
    title:string,
    shortDescription:string,
    content:string,
    blogId:number,
    blogName:string,
}
//ctrl+alt+L reformat