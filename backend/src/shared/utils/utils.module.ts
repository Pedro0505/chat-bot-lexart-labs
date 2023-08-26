import { Module } from '@nestjs/common';
import { PassCryptography } from './PassCryptography';
import { JwtService } from './JwtService';

@Module({
  providers: [PassCryptography, JwtService],
  exports: [PassCryptography, JwtService],
})
export class UtilsModule {}
