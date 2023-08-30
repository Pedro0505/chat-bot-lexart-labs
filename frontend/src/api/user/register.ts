import { ApiRoutes } from '../../constants/ApiRoutes';
import UserDto from '../../dtos/User.dto';
import IToken from '../../interfaces/IToken';
import handlesAxios from '../handleAxios';

const register = async (user: UserDto): Promise<IToken> => {
  const response = await handlesAxios.post(ApiRoutes.USER_REGISTER, user);

  return response.data;
};

export default register;
