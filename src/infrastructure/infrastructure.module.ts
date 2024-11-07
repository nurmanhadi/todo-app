import {  Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { OrmModule } from './orm/orm.module';
import { RepositoryModule } from './repository/repository.module';
import { HelperModule } from './helper/helper.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Global()
@Module({
    imports: [
        OrmModule,
        RepositoryModule,
        HelperModule
    ],
    exports: [
        OrmModule,
        RepositoryModule,
        HelperModule
    ],
})
export class InfrastructureModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(LoggerMiddleware)
        .forRoutes({
            path: "*",
            method: RequestMethod.ALL
        })
    }
}
