import { Body, Controller, HttpCode, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthChangePasswordRequest, AuthForgotPasswordRequest, AuthRequest, AuthResetPasswordRequest } from "src/infrastructure/dto/auth.dto";
import { JsonResponse } from "src/infrastructure/response/json.response";
import { AuthGuard } from "src/infrastructure/guard/auth.guard";
import { Request } from "express";

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    @HttpCode(201)
    async authRegister(@Body() body: AuthRequest): Promise<JsonResponse<boolean>> {
        const result = await this.authService.authRegister(body)
        return {
            statusCode: 201,
            message: "register success",
            data: result,
            url: "/api/auth/register"
        }
    }
    @Post('/login')
    @HttpCode(200)
    async authLogin(@Body() body: AuthRequest): Promise<JsonResponse<any>> {
        const result = await this.authService.authLogin(body)
        return {
            statusCode: 200,
            message: "login success",
            data: {
                token: result
            },
            url: "/api/auth/login"
        }
    }
    @UseGuards(AuthGuard)
    @Post('/logout')
    @HttpCode(200)
    async authLogout(): Promise<JsonResponse<boolean>> {
        return {
            statusCode: 200,
            message: "logout success",
            data: true,
            url: "/api/auth/logout"
        }
    }
    @UseGuards(AuthGuard)
    @Post('/change-password')
    @HttpCode(200)
    async changePassword(@Body() body: AuthChangePasswordRequest, @Req() req: Request): Promise<JsonResponse<boolean>>{
        const id = req["user"]["id"]
        console.info(id)
        const result = await this.authService.changePassword(id, body)
        return {
            statusCode: 200,
            message: "change password success",
            data: result,
            url: "/api/auth/change-password"
        }
    }
    @UseGuards(AuthGuard)
    @Post('/forgot-password')
    @HttpCode(200)
    async forgotPassword(@Body() body: AuthForgotPasswordRequest): Promise<JsonResponse<boolean>> {
        const result = await this.authService.forgotPassword(body)
        return {
            statusCode: 200,
            message: "forgot password success",
            data: result,
            url: "/api/auth/forgot-password"
        }
    }
    @UseGuards(AuthGuard)
    @Post('/reset-password')
    @HttpCode(200)
    async resetPassword(
        @Body() body: AuthResetPasswordRequest,
        @Req() req: Request
    ): Promise<JsonResponse<boolean>>{
        const id = req["user"]["id"]
        const result = await this.authService.resetPassword(id, body)
        return {
            statusCode: 200,
            message: "reset password success",
            data: result,
            url: "/api/auth/reset-password"
        }
    }
}