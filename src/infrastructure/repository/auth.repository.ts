import { Injectable } from "@nestjs/common";
import { AuthRequest } from "../dto/auth.dto";
import { PrismaService } from "../orm/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class AuthRepository {
    constructor(private prismaService: PrismaService){}

    async count(email: string): Promise<number>{
        return this.prismaService.user.count({
            where:{
                email: email
            }
        })
    }
    async register(req: AuthRequest): Promise<User>{
        return this.prismaService.user.create({data: req})
    }
    async findByEmail(email: string): Promise<User>{
        return this.prismaService.user.findUnique({
            where:{
                email: email
            }
        })
    }
    async findById(id: string): Promise<User>{
        return this.prismaService.user.findUnique({
            where:{
                id: id
            }
        })
    }
    async updatePassword(id: string, password: string): Promise<User>{
        return this.prismaService.user.update({
            where:{
                id: id
            },
            data: {
                password: password
            }
        })
    }
}