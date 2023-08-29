import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Home from './pages/home/Home';
import History from './pages/history/History';
import WebRoutes from './constants/WebRoutes';
import './style/app.css';
import { ChatProvider } from './context/chatContext/ChatContext';

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
    </Routes>
  );
}

export default App;
