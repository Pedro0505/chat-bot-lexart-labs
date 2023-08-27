import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiRoutes } from '../../../constants/ApiRoutes';

@Controller(ApiRoutes.AUTH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get(ApiRoutes.VERIFY)
  public async verifyToken(@Headers() headers: { authorization?: string }) {
    const verify = await this.authService.verifyToken(headers.authorization);

    return { authorized: verify };
  }
}
