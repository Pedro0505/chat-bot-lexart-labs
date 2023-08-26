import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/UserCreate.dto';
import { LoginUserDto } from './dto/UserLogin.dto';
import { ApiRoutes } from 'src/constants/ApiRoutes';
import { ConversationCreateDto } from './dto/ConversationCreate.dto';

@Controller(ApiRoutes.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(ApiRoutes.REGISTER)
  public async register(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Post(ApiRoutes.LOGIN)
  public async login(@Body() body: LoginUserDto) {
    return this.userService.login(body);
  }

  @Post(ApiRoutes.HISTORY)
  public async registerHistory(@Body() body: ConversationCreateDto) {
    return this.userService.registerHistory(body);
  }

  @Get(ApiRoutes.HISTORY)
  public async getHistory() {
    return this.userService.getHistory();
  }
}
