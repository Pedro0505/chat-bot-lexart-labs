import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelNames } from '../../constants/ModelNames';
import { Model } from 'mongoose';
import IUser from '../../shared/entities/user/interfaces/IUser';
import { usersData } from './data/user';

@Injectable()
export default class SeedService implements OnApplicationBootstrap {
  constructor(@InjectModel(ModelNames.USER) private userModel: Model<IUser>) {}

  public async createUser() {
    const users = await this.userModel.find();

    if (users.length === 0) {
      const usersPromise = usersData.map((e) => this.userModel.create(e));

      await Promise.all(usersPromise);

      console.log('Users seeds were applied');
    }
  }

  onApplicationBootstrap() {
    const NODE_ENV = process.env.NODE_ENV;

    if (NODE_ENV === 'DEV') {
      this.createUser();
    }
  }
}
