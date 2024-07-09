export type WebResponse<T> = {
    message: string,
    data?: T,
    errors?: string
}