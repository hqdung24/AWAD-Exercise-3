import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { UsersModule } from './users/users.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_PIPE, APP_FILTER } from '@nestjs/core/constants';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ZodValidationPipe }, // Global validation pipe sử dụng Zod
    { provide: APP_FILTER, useClass: AllExceptionsFilter }, // Global exception filter
  ],
})
export class AppModule {}
