import { ApiRoutes } from '../../constants/ApiRoutes';
import IAuthorized from '../../interfaces/IAuthorized';
import { getCookie } from '../../utils/handleCookies';
import handlesAxios from '../handleAxios';

const verifyToken = async (cookieName: string): Promise<IAuthorized> => {
  const token = getCookie(cookieName);

  const response = await handlesAxios.get(ApiRoutes.AUTH_VERIFY, { headers: { Authorization: token } });

  return response.data;
};

export default verifyToken;
