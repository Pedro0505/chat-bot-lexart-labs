import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header';
import MessageList from '../../components/messageList/MessageList';
import MessageInput from '../../components/messageInput/MessageInput';
import { ChatContext } from '../../context/chatContext/ChatContext';
import IMessage from '../../interfaces/IMessage';
import LoginForm from '../../components/loginForm/LoginForm';
import LoanInfos from '../../components/loanInfos/LoanInfos';
import Goodbye from '../../components/goodbye/Goodbye';
import addHistory from '../../api/user/addHistory';
import './style.css';
import { removeCookie } from '../../utils/handleCookies';
import useDocumentTitle from '../../hook/useDocumentTitle';

function Chat() {
  const { addMessage, messages, handleSubmitBtnDisable, loginSuccessfully, handleEndChat } = useContext(ChatContext);
  useDocumentTitle('Chat');

  const botResponses: Record<string, JSX.Element> = {
    goodbye: <Goodbye />,
    loan: <LoanInfos />,
    login: loginSuccessfully ? <span>Ask me about loan</span> : <LoginForm />,
  };

  const handleGoodbye = async () => {
    try {
      await addHistory({ waxing_time: new Date().toISOString() }, 'chat-user-token');

      handleEndChat(true);
      removeCookie('chat-user-token');
    } catch (error) {
      console.log(error);
    }
  };

  const handleInit = (messageText: string) => {
    if (!loginSuccessfully) {
      const initPhrase = /Hello|Goodbye|Good|I want/i.test(messageText) ? 'login' : '';

      if (initPhrase === 'login' && !loginSuccessfully) {
        handleSubmitBtnDisable(true);
      }

      const botResponseComponent = botResponses[initPhrase];

      if (botResponseComponent) {
        const botResponse: IMessage = { text: botResponseComponent, sender: 'bot' };

        addMessage(botResponse);
      }
    }
  };

  const handleConversation = async (messageText: string) => {
    if (loginSuccessfully) {
      const goodbye = messageText.trim().toLocaleLowerCase() === 'goodbye' ? 'goodbye' : '';
      const loan = /loan/i.test(messageText) ? 'loan' : '';

      if (goodbye !== '') {
        await handleGoodbye();
      }

      const decideBotComponent = botResponses[goodbye !== '' ? goodbye : loan];

      if (decideBotComponent) {
        const botResponse: IMessage = { text: decideBotComponent, sender: 'bot' };

        addMessage(botResponse);
      }
    }
  };

  const handleSendMessage = async (messageText: string) => {
    const userMessage: IMessage = { text: messageText, sender: 'user' };

    addMessage(userMessage);

    handleInit(messageText);

    handleConversation(messageText);
  };

  return (
    <main className="chat-container">
      <Header>
        <Link to="/">Home</Link>
        <Link to="/history">History</Link>
      </Header>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </main>
  );
}

export default Chat;
