import { ApiRoutes } from '../../constants/ApiRoutes';
import IHistory from '../../interfaces/IHistory';
import { getCookie } from '../../utils/handleCookies';
import handlesAxios from '../handleAxios';

const getHistory = async (): Promise<IHistory[]> => {
  const token = getCookie('user-session');

  const response = await handlesAxios.get(ApiRoutes.USER_HISTORY, { headers: { Authorization: token } });

  return response.data;
};

export default getHistory;
