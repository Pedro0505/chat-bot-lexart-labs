import IConversation from './IConversation';

interface IUser {
  username: string;
  password: string;
  conversations: IConversation[];
}

export default IUser;
