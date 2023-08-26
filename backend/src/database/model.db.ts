import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelNames } from '../constants/ModelNames';
import { UserSchema } from './models/user.model';

export const modelForFeature = MongooseModule.forFeature([
  {
    name: ModelNames.USER,
    schema: UserSchema,
  },
]);

export const modelForRoot = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const nodeEnv = config.get<string>('NODE_ENV');
    const dbName = nodeEnv === 'TEST' ? 'DATABASE_URL_TEST' : 'DATABASE_URL';
    const uri = config.get<string>(dbName);
    return {
      uri,
    };
  },
});
