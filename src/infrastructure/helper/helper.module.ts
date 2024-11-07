import { JwtModule } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { SecretKey } from '../config/env.config';
import { JwtHelper } from './jwt.helper';
import { MailHelper } from './mail.helper';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: SecretKey.secret
        })
    ],
    providers: [JwtHelper, MailHelper],
    exports: [JwtHelper, MailHelper]
})
export class HelperModule {}