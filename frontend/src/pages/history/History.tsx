import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import getHistory from '../../api//user/getHistory';
import './style.css';
import IHistory from '../../interfaces/IHistory';
import useTokenRedirect from '../../hook/useTokenRedirect';
import WebRoutes from '../../constants/WebRoutes';
import { removeCookie } from '../../utils/handleCookies';
import HistoryTable from '../../components/historyTable/HistoryTable';

function History() {
  const [history, setHistory] = useState<IHistory[]>([]);
  const navigator = useNavigate();
  useTokenRedirect(WebRoutes.LOGIN, WebRoutes.HISTORY);

  const fetchHistory = async () => {
    try {
      const historyResponse = await getHistory();

      setHistory(historyResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    removeCookie('user-session');
    navigator('/');
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <Header>
        <Link to="/">Home</Link>
        <Link to="/chat">Chat</Link>
        <button className="button-logout" onClick={handleLogout}>
          Logout
        </button>
      </Header>
      <div className="history-table-container">
        <h1 className="history-heading">History</h1>
        <HistoryTable history={history} />
      </div>
    </div>
  );
}

export default History;
