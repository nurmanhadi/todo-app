import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtHelper {
    constructor(private jwtService: JwtService){}

    async generateAccessToken(payload: any): Promise<string>{
        return this.jwtService.signAsync(payload, { expiresIn: '7d' })
    }
    async generateTokenForgotPassword(payload: any): Promise<string>{
        return this.jwtService.signAsync(payload, { expiresIn: '3m' })
    }
}