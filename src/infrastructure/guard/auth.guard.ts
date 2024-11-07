import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { SecretKey } from "../config/env.config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if(!token){
            throw new HttpException({
                statusCode: 401,
                message: "unauthorized",
                error: "token undefined"
            }, 401)
        }
        try{
            const payload = await this.jwtService.verifyAsync(token, {
                secret: SecretKey.secret
            })
            request["user"] = payload
        }catch{
            throw new HttpException({
                statusCode: 401,
                message: "unauthorized",
                error: "token invalid or expired"
            }, 401)
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}