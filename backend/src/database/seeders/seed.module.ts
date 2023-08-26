import { Module } from '@nestjs/common';
import SeedService from './Seed.service';
import { modelForFeature, modelForRoot } from '../model.db';

@Module({
  imports: [modelForFeature, modelForRoot],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
