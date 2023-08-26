import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { modelForFeature, modelForRoot } from 'src/database/model.db';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  imports: [modelForFeature, modelForRoot, AuthModule, UtilsModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
