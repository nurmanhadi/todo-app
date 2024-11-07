export class JsonResponse<T> {
    statusCode: number
    message: string
    data: T
    url: string
}