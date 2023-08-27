import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import History from './pages/history/History';
import WebRoutes from './constants/WebRoutes';
import './style/app.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path={WebRoutes.HOME} element={<Home />} />
        <Route path={WebRoutes.CHAT} element={<Chat />} />
        <Route path={WebRoutes.HISTORY} element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
