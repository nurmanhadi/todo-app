import { HttpException, Injectable } from "@nestjs/common";
import { AuthChangePasswordRequest, AuthForgotPasswordRequest, AuthRequest, AuthResetPasswordRequest } from "src/infrastructure/dto/auth.dto";
import { HashBcrypt } from "src/infrastructure/helper/bcrypt.helper";
import { JwtHelper } from "src/infrastructure/helper/jwt.helper";
import { MailHelper } from "src/infrastructure/helper/mail.helper";
import { AuthRepository } from "src/infrastructure/repository/auth.repository";

@Injectable()
export class AuthService {
    constructor(
        private authRepository: AuthRepository,
        private jwtHelper: JwtHelper,
        private mailHelper: MailHelper
    ){}

    async authRegister(body: AuthRequest): Promise<boolean> {
        const checkEmail = await this.authRepository.count(body.email)
        if(checkEmail > 0){
            throw new HttpException({
                statusCode: 409,
                message: "conflict",
                error: "email already exist"
            }, 409)
        }
        const hashPassword = await HashBcrypt.hashPassword(body.password)
        body.password = hashPassword
        await this.authRepository.register(body)
        return true
    }
    async authLogin(body: AuthRequest): Promise<string>{
        const user = await this.authRepository.findByEmail(body.email)
        if(!user){
            throw new HttpException({
                statusCode: 400,
                message: "bad request",
                error: "email or password is wrong"
            }, 400)
        }
        const comparePassword = await HashBcrypt.comparePassword(body.password, user.password)
        if(comparePassword == false){
            throw new HttpException({
                statusCode: 400,
                message: "bad request",
                error: "email or password is wrong"
            }, 400)
        }
        const payload = {id: user.id}
        const token = await this.jwtHelper.generateAccessToken(payload)
        return token
    }
    async changePassword(id: string, body: AuthChangePasswordRequest): Promise<boolean>{
        const user = await this.authRepository.findById(id)
        if(!user){
            throw new HttpException({
                statusCode: 404,
                message: "not found",
                error: "user not found"
            }, 404)
        }
        const compareOldPassword = await HashBcrypt.comparePassword(body.oldPassword, user.password)
        if(compareOldPassword == false){
            throw new HttpException({
                statusCode: 400,
                message: "bad request",
                error: "old password is wrong"
            }, 400)
        }
        const hashNewPassword = await HashBcrypt.hashPassword(body.newPassword)
        await this.authRepository.updatePassword(id, hashNewPassword)
        return true
    }
    async forgotPassword(body: AuthForgotPasswordRequest): Promise<boolean> {
        const user = await this.authRepository.findByEmail(body.email)
        if(!user){
            throw new HttpException({
                statusCode: 404,
                message: "not found",
                error: "email not found"
            }, 404)
        }
        const payload = {id: user.id}
        const token = await this.jwtHelper.generateTokenForgotPassword(payload)
        await this.mailHelper.EmailVerification(user.email, token)
        return true
    }
    async resetPassword(id: string, body: AuthResetPasswordRequest): Promise<boolean> {
        const user = await this.authRepository.findById(id)
        if(!user){
            throw new HttpException({
                statusCode: 404,
                message: "not found",
                error: "user not found"
            }, 404)
        }
        const hashNewPassword = await HashBcrypt.hashPassword(body.newPassword)
        await this.authRepository.updatePassword(id, hashNewPassword)
        return true
    }
    
}