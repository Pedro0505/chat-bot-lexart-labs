import { ApiRoutes } from '../../constants/ApiRoutes';
import UserDto from '../../dtos/User.dto';
import IToken from '../../interfaces/IToken';
import handlesAxios from '../handleAxios';

const login = async (user: UserDto): Promise<IToken> => {
  const response = await handlesAxios.post(ApiRoutes.USER_LOGIN, user);

  return response.data;
};

export default login;
