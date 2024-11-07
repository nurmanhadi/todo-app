import { IsEmail, IsNotEmpty, Max, MaxLength, Min, MinLength } from "class-validator"

export class AuthRequest {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    password: string
}
export class AuthChangePasswordRequest {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    oldPassword: string

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    newPassword: string
}
export class AuthForgotPasswordRequest {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    @IsEmail()
    email: string
}
export class AuthResetPasswordRequest {
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    newPassword: string
}