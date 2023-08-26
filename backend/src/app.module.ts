import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './shared/entities/user/user.module';
import AuthMiddleware from './shared/middlewares/auth.middleware';
import { ApiRoutes } from './constants/ApiRoutes';
import { UtilsModule } from './shared/utils/utils.module';
import { SeedModule } from './database/seeders/seed.module';

@Module({
  imports: [
    UserModule,
    UtilsModule,
    SeedModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ApiRoutes.USER_HISTORY);
  }
}
