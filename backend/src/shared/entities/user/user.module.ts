import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { modelForFeature, modelForRoot } from 'src/database/model.db';

@Module({
  imports: [modelForFeature, modelForRoot],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
