export type WebResponse<T> = {
    message: string,
    data?: T,
    errors?: string,
    paging?: Paging 
}

export type Paging = {
    size: number,
    totalPage: number,
    currentPage: number
}