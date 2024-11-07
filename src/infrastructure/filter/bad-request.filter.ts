import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const status = exception.getStatus()
        const excResponse = exception.getResponse()

        response.status(status).json({
            statusCode: status,
            mmessage: "bad request",
            error: excResponse["message"]
        })
    }
}