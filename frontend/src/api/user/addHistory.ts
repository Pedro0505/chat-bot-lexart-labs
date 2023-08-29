import { ApiRoutes } from '../../constants/ApiRoutes';
import IHistory from '../../interfaces/IHistory';
import { getCookie } from '../../utils/handleCookies';
import handlesAxios from '../handleAxios';

const addHistory = async (history: Omit<IHistory, '_id'>, cookieKey: string): Promise<void> => {
  const token = getCookie(cookieKey);

  await handlesAxios.post(ApiRoutes.USER_HISTORY, history, { headers: { Authorization: token } });
};

export default addHistory;
