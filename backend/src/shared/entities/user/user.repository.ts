import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelNames } from '../../../constants/ModelNames';
import { IUser } from '../../../database/models/user.model';
import { CreateUserDto } from './dto/UserCreate.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(ModelNames.USER) private userModel: Model<IUser>) {}

  public async getByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }

  public async getById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  public async create(user: CreateUserDto) {
    return await this.userModel.create(user);
  }
}
