import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/handleCookies';
import verifyToken from '../api/user/verifyToken';

const useTokenRedirect = (authPath: string, authorizedPath: string) => {
  const navigate = useNavigate();
  const authorized = useRef(false);

  useEffect(() => {
    (async () => {
      const token = getCookie('user-session');
      if (token === undefined) {
        navigate(authPath);
        return;
      }

      try {
        const verify = await verifyToken('user-session');
        authorized.current = verify.authorized;
        if (verify.authorized) {
          navigate(authorizedPath);
        } else {
          navigate(authPath);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return authorized;
};

export default useTokenRedirect;
