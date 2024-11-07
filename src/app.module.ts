import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DomainModule,
    InfrastructureModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100
    }])
  ]
})
export class AppModule {}
