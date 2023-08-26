import {
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/UserCreate.dto';
import { AuthService } from '../auth/auth.service';
import { PassCryptography } from 'src/shared/utils/PassCryptography';
import { LoginUserDto } from './dto/UserLogin.dto';
import { ConversationCreateDto } from './dto/ConversationCreate.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly passCryptography: PassCryptography,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public async register(user: CreateUserDto) {
    const findUser = await this.userRepository.getByUsername(user.username);

    if (findUser !== null) {
      throw new ConflictException('Usuário já existe');
    }

    const newPass = await this.passCryptography.bcryptEncrypt(user.password);

    user.password = newPass;

    const newUser = await this.userRepository.create(user);

    const token = await this.authService.generateToken({
      userId: newUser._id,
      username: newUser.username,
    });

    return { token };
  }

  public async login(user: LoginUserDto) {
    const getUser = await this.userRepository.getByUsername(user.username);

    if (!getUser) {
      throw new UnauthorizedException('Usuário não cadastrado');
    }

    const token = await this.authService.signIn(
      user.password,
      getUser.password,
      getUser.id,
      getUser.username,
    );

    return { token };
  }

  public async registerHistory(history: ConversationCreateDto) {
    const user = await this.userRepository.getById(
      this.request.tokenData.userId,
    );

    user.conversations.push(history);

    await user.save();

    return { username: user.username, conversations: user.conversations };
  }

  public async getHistory() {
    const id = this.request.tokenData.userId;

    const conversations = (await this.userRepository.getById(id)).conversations;

    return conversations;
  }
}
