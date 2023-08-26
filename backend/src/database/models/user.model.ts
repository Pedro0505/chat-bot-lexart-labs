import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  conversations: { waxing_time: Date }[];
}

export const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    conversations: { type: [{ waxing_time: Date }], required: true },
  },
  { versionKey: false },
);
