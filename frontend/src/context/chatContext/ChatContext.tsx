import React, { createContext, useState } from 'react';
import IChatContextProps from './interfaces/IChatContextProps';
import IChatContextType from './interfaces/IChatContextType';
import IMessage from '../../interfaces/IMessage';
import { removeCookie } from '../../utils/handleCookies';

const initialValue: IChatContextType = {
  messages: [],
  addMessage: () => {},
  handleSubmitBtnDisable: () => {},
  submitBtnDisable: false,
  loginSuccessfully: false,
  handleLoginSuccessfully: () => {},
  endChat: false,
  handleEndChat: () => {},
  resetChat: () => {},
};

export const ChatContext = createContext<IChatContextType>(initialValue);

export const ChatProvider = ({ children }: IChatContextProps) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [submitBtnDisable, setSubmitBtnDisable] = useState(false);
  const [loginSuccessfully, setLoginSuccessfully] = useState(false);
  const [endChat, setEndChat] = useState(false);

  const addMessage = (message: IMessage) => {
    setMessages(prevState => [...prevState, message]);
  };

  const resetChat = () => {
    setMessages([]);
    setLoginSuccessfully(false);
    removeCookie('chat-user-token');
  };

  const handleLoginSuccessfully = (isDisable: boolean) => {
    setLoginSuccessfully(isDisable);
  };

  const handleSubmitBtnDisable = (isDisable: boolean) => {
    setSubmitBtnDisable(isDisable);
  };

  const handleEndChat = (isDisable: boolean) => {
    setEndChat(isDisable);
  };

  const context = {
    messages,
    addMessage,
    submitBtnDisable,
    handleSubmitBtnDisable,
    loginSuccessfully,
    handleLoginSuccessfully,
    endChat,
    handleEndChat,
    resetChat,
  };

  return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>;
};
