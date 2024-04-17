export type QueryInputType = {
    pageNumber?: number
    pageSize?: number
    sortBy?: string
    sortDirection?: 'asc' | 'desc'
    searchNameTerm?: string | null
    searchLoginTerm?: string | null
    searchEmailTerm?: string | null
}
export type QueryOutputType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: 'asc' | 'desc'
    searchNameTerm: string | null
    searchLoginTerm: string | null
    searchEmailTerm: string | null
}
export const helper = (query: QueryInputType): QueryOutputType => {
    return {
        pageNumber: !isNaN(Number(query.pageNumber))
            ? Number(query.pageNumber)
            : 1,
        pageSize: !isNaN(Number(query.pageSize))
            ? Number(query.pageSize)
            : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
        searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null
    }
}