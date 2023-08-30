import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import History from './pages/history/History';
import WebRoutes from './constants/WebRoutes';
import './style/app.css';
import { ChatProvider } from './context/chatContext/ChatContext';
import Login from './pages/login/Login';
import Register from './pages/register/Register';

function App() {
  return (
    <Routes>
      <Route path={WebRoutes.HOME} element={<Home />} />
      <Route
        path={WebRoutes.CHAT}
        element={
          <ChatProvider>
            <Chat />
          </ChatProvider>
        }
      />
      <Route path={WebRoutes.HISTORY} element={<History />} />
      <Route path={WebRoutes.LOGIN} element={<Login />} />
      <Route path={WebRoutes.REGISTER} element={<Register />} />
    </Routes>
  );
}

export default App;
